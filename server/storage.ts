import { 
  type User, 
  type InsertUser, 
  type PurposeCard,
  type InsertPurposeCard,
  type Session,
  type InsertSession,
  type Swipe,
  type InsertSwipe,
  users,
  purposeCards,
  sessions,
  swipes
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Purpose cards
  getPurposeCards(): Promise<PurposeCard[]>;
  seedPurposeCards(): Promise<void>;
  
  // Sessions
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  completeSession(id: string): Promise<Session | undefined>;
  getUserSessions(sessionData: any): Promise<Session[]>;
  
  // Swipes
  recordSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSessionSwipes(sessionId: string): Promise<Swipe[]>;
  getSwipeResults(sessionId: string): Promise<Record<string, number>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPurposeCards(): Promise<PurposeCard[]> {
    return await db.select().from(purposeCards);
  }

  async seedPurposeCards(): Promise<void> {
    const existingCards = await this.getPurposeCards();
    if (existingCards.length === 0) {
      const cardData: InsertPurposeCard[] = [
        {
          id: 'family',
          title: 'Family',
          description: 'Building strong relationships with loved ones and creating lasting memories together.',
          image: '/assets/generated_images/Family_purpose_card_image_6846aeb5.png',
          category: 'Relationships'
        },
        {
          id: 'adventure',
          title: 'Adventure',
          description: 'Exploring new places, taking risks, and pushing beyond your comfort zone.',
          image: '/assets/generated_images/Adventure_purpose_card_image_97206d4a.png',
          category: 'Experience'
        },
        {
          id: 'wealth',
          title: 'Wealth',
          description: 'Building financial security and creating abundance for yourself and others.',
          image: '/assets/generated_images/Wealth_purpose_card_image_b1579e59.png',
          category: 'Financial'
        },
        {
          id: 'growth',
          title: 'Personal Growth',
          description: 'Continuously learning, improving, and becoming the best version of yourself.',
          image: '/assets/generated_images/Growth_purpose_card_image_308e20b7.png',
          category: 'Development'
        },
        {
          id: 'service',
          title: 'Service',
          description: 'Helping others, making a positive impact, and contributing to your community.',
          image: '/assets/generated_images/Service_purpose_card_image_20abfd0a.png',
          category: 'Social Impact'
        },
        {
          id: 'creativity',
          title: 'Creativity',
          description: 'Expressing yourself through art, innovation, and bringing new ideas to life.',
          image: '/assets/generated_images/Creativity_purpose_card_image_6e18aa6e.png',
          category: 'Expression'
        }
      ];
      await db.insert(purposeCards).values(cardData);
    }
  }

  async createSession(session: InsertSession): Promise<Session> {
    const [newSession] = await db
      .insert(sessions)
      .values(session)
      .returning();
    return newSession;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async completeSession(id: string): Promise<Session | undefined> {
    const [session] = await db
      .update(sessions)
      .set({ completedAt: new Date() })
      .where(eq(sessions.id, id))
      .returning();
    return session || undefined;
  }

  async getUserSessions(sessionData: any): Promise<Session[]> {
    return await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionData, sessionData))
      .orderBy(desc(sessions.createdAt));
  }

  async recordSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const [newSwipe] = await db
      .insert(swipes)
      .values(swipe)
      .returning();
    return newSwipe;
  }

  async getSessionSwipes(sessionId: string): Promise<Swipe[]> {
    return await db
      .select()
      .from(swipes)
      .where(eq(swipes.sessionId, sessionId))
      .orderBy(swipes.timestamp);
  }

  async getSwipeResults(sessionId: string): Promise<Record<string, number>> {
    const sessionSwipes = await db
      .select({
        direction: swipes.direction,
        category: purposeCards.category
      })
      .from(swipes)
      .innerJoin(purposeCards, eq(swipes.cardId, purposeCards.id))
      .where(eq(swipes.sessionId, sessionId));
    
    const results: Record<string, number> = {};
    for (const swipe of sessionSwipes) {
      if (swipe.direction === 'right') {
        results[swipe.category] = (results[swipe.category] || 0) + 1;
      }
    }
    
    return results;
  }
}

export const storage = new DatabaseStorage();