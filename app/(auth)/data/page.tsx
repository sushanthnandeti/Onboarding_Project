

import { db } from "@/server/db";
import { users } from "@/server/schema";
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import type { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>;

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DataPage() {

  let allUsers: User[] = [];
  let error: string | null = null;

  try {
    allUsers = await db.select().from(users);
  } catch (err) {
    console.error("Database error:", err);
    error = err instanceof Error ? err.message : "Unknown database error";
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-black-700 text-center">Users Data</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Database Error:</strong> {error}
          <br />
          <small>Check your DATABASE_URL environment variable on Vercel</small>
        </div>
      )}

      {allUsers.length === 0 && !error && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <strong>No Data Found:</strong> No users found in the database.
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-blue-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-500">
              <TableHead className="text-black">First Name</TableHead>
              <TableHead className="text-black">Last Name</TableHead>
              <TableHead className="text-black">Email</TableHead>
              <TableHead className="text-black">About Me</TableHead>
              <TableHead className="text-black">Street Address</TableHead>
              <TableHead className="text-black">City</TableHead>
              <TableHead className="text-black">State</TableHead>
              <TableHead className="text-black">Zip Code</TableHead>
              <TableHead className="text-black">Birthdate</TableHead>
              <TableHead className="text-black">Skill Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.map((user) => (
              <TableRow key={user.id} className="bg-blue-50">
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.aboutMe}</TableCell>
                <TableCell>{user.streetAddress}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.zipCode}</TableCell>
                <TableCell>{user.birthdate}</TableCell>
                <TableCell>{user.skillLevel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}