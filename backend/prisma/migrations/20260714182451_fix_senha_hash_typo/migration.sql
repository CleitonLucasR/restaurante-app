/*
  Warnings:

  - You are about to drop the column `sanhaHash` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `senhaHash` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "sanhaHash",
ADD COLUMN     "senhaHash" TEXT NOT NULL;
