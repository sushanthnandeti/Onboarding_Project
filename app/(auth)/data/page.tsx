import { db } from "@/server/db";
import { users } from "@/server/schema";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function DataPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-black-700">All Users</h1>
      <Table className=" rounded-md shadow-lg overflow-hidden border border-blue-200">
        <TableHeader>
          <TableRow className="bg-blue-400">
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
        <TableBody className="bg-blue-50">
          {allUsers.map((user) => (
            <TableRow key={user.id} className="hover:bg-blue-100">
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
  );
}