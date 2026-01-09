-- CreateTable
CREATE TABLE "public"."HistoriaClinica" (
    "id" SERIAL NOT NULL,
    "pacienteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriaClinica_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HistoriaRegistro" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diagnostico" TEXT NOT NULL,
    "tratamiento" TEXT NOT NULL,
    "observaciones" TEXT,
    "historiaId" INTEGER NOT NULL,
    "odontologoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoriaRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoriaClinica_pacienteId_key" ON "public"."HistoriaClinica"("pacienteId");

-- AddForeignKey
ALTER TABLE "public"."HistoriaClinica" ADD CONSTRAINT "HistoriaClinica_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriaRegistro" ADD CONSTRAINT "HistoriaRegistro_historiaId_fkey" FOREIGN KEY ("historiaId") REFERENCES "public"."HistoriaClinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoriaRegistro" ADD CONSTRAINT "HistoriaRegistro_odontologoId_fkey" FOREIGN KEY ("odontologoId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
