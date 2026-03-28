import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// API para gestionar prendas
// GET: Lee todas las prendas
// POST: Agrega una prenda nueva
// PUT: Actualiza una prenda (marcar vendido, editar datos)
// DELETE: Elimina una prenda

const DATA_PATH = path.join(process.cwd(), "public", "data", "prendas.json");

function readData() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeData(data: unknown) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET — Leer prendas
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 500 });
  }
}

// POST — Agregar prenda
export async function POST(req: NextRequest) {
  try {
    const prenda = await req.json();
    const data = readData();

    // Generar ID único
    prenda.id = String(Date.now());
    prenda.disponible = true;

    data.prendas.unshift(prenda);
    writeData(data);

    return NextResponse.json({ success: true, prenda });
  } catch {
    return NextResponse.json({ error: "No se pudo agregar" }, { status: 500 });
  }
}

// PUT — Actualizar prenda (marcar vendido, editar)
export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    const data = readData();

    const index = data.prendas.findIndex((p: { id: string }) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Prenda no encontrada" }, { status: 404 });
    }

    data.prendas[index] = { ...data.prendas[index], ...updates };
    writeData(data);

    return NextResponse.json({ success: true, prenda: data.prendas[index] });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  }
}

// DELETE — Eliminar prenda
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const data = readData();

    data.prendas = data.prendas.filter((p: { id: string }) => p.id !== id);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar" }, { status: 500 });
  }
}
