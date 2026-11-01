'use server'

import { auth } from "@clerk/nextjs/server"
import { randomUUID } from "node:crypto"
import { db } from "../db"

type CompanionRecord = {
    id: string;
    name: string;
    subject: string;
    topic: string;
    duration: number;
    voice: string;
    style: string;
    author: string;
    created_at: string;
}

const getFilterValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

export const createCompanion = async (formData : CreateCompanion) => {
    const {userId : author} = await auth();
    if (!author) throw new Error("You must be signed in to create a companion")

    const id = randomUUID()
    db.prepare(`
        INSERT INTO companions (id, name, subject, topic, duration, voice, style, author)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, formData.name, formData.subject, formData.topic, formData.duration, formData.voice, formData.style, author)

    return db.prepare("SELECT * FROM companions WHERE id = ?").get(id) as CompanionRecord;
}


export const getAllCompanions = async ({limit = 10 , page = 1, subject , topic}:GetAllCompanions) => {
    const subjectValue = getFilterValue(subject)
    const topicValue = getFilterValue(topic)
    const filters: string[] = []
    const parameters: string[] = []

    if (subjectValue) {
        filters.push("subject LIKE ? COLLATE NOCASE")
        parameters.push(`%${subjectValue}%`)
    }
    if (topicValue) {
        filters.push("(topic LIKE ? COLLATE NOCASE OR name LIKE ? COLLATE NOCASE)")
        parameters.push(`%${topicValue}%`, `%${topicValue}%`)
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : ""
    const safeLimit = Math.max(0, Math.trunc(limit))
    const offset = Math.max(0, Math.trunc(page - 1)) * safeLimit

    return db.prepare(`
        SELECT * FROM companions
        ${whereClause}
        LIMIT ? OFFSET ?
    `).all(...parameters, safeLimit, offset) as CompanionRecord[];
}

export const getCompanion = async (id : string) => {
    return db.prepare("SELECT * FROM companions WHERE id = ?").get(id) as CompanionRecord | undefined;
}

export const addToSessionHistory = async (companionId : string) => {
    const {userId} = await auth();
    if (!userId) throw new Error("You must be signed in to record a session")

    return db.prepare(`
        INSERT INTO session_history (companion_id, user_id)
        VALUES (?, ?)
    `).run(companionId, userId);
}

export const getRecentSessions = async (limit = 10) => {
    const safeLimit = Math.max(0, Math.trunc(limit))
    return db.prepare(`
        SELECT companions.*
        FROM session_history
        INNER JOIN companions ON companions.id = session_history.companion_id
        ORDER BY session_history.created_at DESC, session_history.id DESC
        LIMIT ?
    `).all(safeLimit) as CompanionRecord[];
}
export const getUserSessions = async (userId : string , limit = 10) => {
    const {userId: authenticatedUserId} = await auth()
    if (!authenticatedUserId || authenticatedUserId !== userId) {
        throw new Error("You can only view your own session history")
    }

    const safeLimit = Math.max(0, Math.trunc(limit))
    return db.prepare(`
        SELECT companions.*
        FROM session_history
        INNER JOIN companions ON companions.id = session_history.companion_id
        WHERE session_history.user_id = ?
        ORDER BY session_history.created_at DESC, session_history.id DESC
        LIMIT ?
    `).all(userId, safeLimit) as CompanionRecord[];
}
export const getUserCompanions = async (userId : string) => {
    const {userId: authenticatedUserId} = await auth()
    if (!authenticatedUserId || authenticatedUserId !== userId) {
        throw new Error("You can only view your own companions")
    }

    return db.prepare("SELECT * FROM companions WHERE author = ?").all(userId) as CompanionRecord[];
}

export const newCompanionPermission = async () => {
    const {userId , has} = await auth();
    if (!userId) return false;

    let limit = 0;

    if(has({plan : 'pro'})) {
        return true;
    } else if (has({feature : '3_companion_limit'})) {
        limit = 3;
    }  else if (has({feature : '10_companion_limit'})) {
        limit = 10;
    }

    const {count} = db.prepare(
        "SELECT COUNT(*) AS count FROM companions WHERE author = ?"
    ).get(userId) as {count: number};

    return count < limit;
}