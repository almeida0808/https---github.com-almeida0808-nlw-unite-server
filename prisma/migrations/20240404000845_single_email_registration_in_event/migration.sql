/*
  Warnings:

  - A unique constraint covering the columns `[event_id,email]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clients_event_id_email_key" ON "clients"("event_id", "email");
