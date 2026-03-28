"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Star,
  Pencil,
  Trash2,
  RotateCcw,
  Check,
  Eye,
  Plus,
  X,
  ImagePlus,
  Sparkles,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface Prenda {
  id: string;
  imagen: string;
  nombre: string;
  marca?: string;
  precio: number;
  precioOriginal?: number;
  talla: string;
  estado: string;
  disponible: boolean;
  destacada?: boolean;
  dropId?: string;
  color?: string;
  medidas?: Record<string, string>;
  equivalencia?: string;
  descripcionEstado?: string;
}

interface Drop {
  id: string;
  fecha: string;
  dia: string;
  estado: string;
  prendas: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────
const ESTADO_LABELS: Record<string, string> = {
  "nuevo-etiqueta": "Nuevo con etiqueta",
  "como-nuevo": "Como nuevo",
  "buen-estado": "Buen estado",
};

const ESTADO_COLORS: Record<string, string> = {
  "nuevo-etiqueta": "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  "como-nuevo": "bg-sky-500/20 text-sky-400 border border-sky-500/30",
  "buen-estado": "bg-amber-500/20 text-amber-400 border border-amber-500/30",
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString("es-CO");
}

function getDiscount(precio: number, precioOriginal?: number) {
  if (!precioOriginal || precioOriginal <= precio) return null;
  return Math.round(((precioOriginal - precio) / precioOriginal) * 100);
}

// ─── Main Component ──────────────────────────────────────────────────
export default function AdminPage() {
  const [prendas, setPrendas] = useState<Prenda[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDrop, setActiveDrop] = useState<string>("all");
  const [showNewDropModal, setShowNewDropModal] = useState(false);
  const [newDropDate, setNewDropDate] = useState("");
  const [newDropDia, setNewDropDia] = useState("jueves");

  // Drag & drop
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editingPrenda, setEditingPrenda] = useState<Prenda | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    marca: "",
    precio: "",
    precioOriginal: "",
    talla: "",
    estado: "como-nuevo",
    imagen: "",
    equivalencia: "",
    descripcionEstado: "",
    color: "",
    largo: "",
    busto: "",
    cintura: "",
    cadera: "",
    destacada: false,
  });

  // Confirm delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ─── Load data ───────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/prendas");
      const data = await res.json();
      setPrendas(data.prendas || []);
      setDrops(data.drops || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ─── Stats ───────────────────────────────────────────────────────
  const total = prendas.length;
  const disponibles = prendas.filter((p) => p.disponible).length;
  const vendidas = prendas.filter((p) => !p.disponible).length;
  const destacadas = prendas.filter((p) => p.destacada).length;

  // ─── Filtered prendas by active drop ─────────────────────────────
  const filteredPrendas =
    activeDrop === "all"
      ? prendas
      : prendas.filter((p) => p.dropId === activeDrop);

  // ─── Drag & Drop handlers ────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    for (const file of imageFiles) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const nombre = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        const prenda: Partial<Prenda> = {
          nombre: nombre.charAt(0).toUpperCase() + nombre.slice(1),
          imagen: base64,
          precio: 0,
          talla: "M",
          estado: "como-nuevo",
          disponible: true,
          destacada: false,
          dropId: activeDrop !== "all" ? activeDrop : drops[0]?.id || "",
        };
        await fetch("/api/prendas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prenda),
        });
        loadData();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  // ─── Toggle actions ──────────────────────────────────────────────
  async function toggleDisponible(prenda: Prenda) {
    await fetch("/api/prendas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prenda.id, disponible: !prenda.disponible }),
    });
    loadData();
  }

  async function toggleDestacada(prenda: Prenda) {
    await fetch("/api/prendas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prenda.id, destacada: !prenda.destacada }),
    });
    loadData();
  }

  async function deletePrenda(id: string) {
    await fetch("/api/prendas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeletingId(null);
    loadData();
  }

  // ─── Edit modal ──────────────────────────────────────────────────
  function openEdit(prenda: Prenda) {
    setEditingPrenda(prenda);
    setEditForm({
      nombre: prenda.nombre,
      marca: prenda.marca || "",
      precio: String(prenda.precio),
      precioOriginal: prenda.precioOriginal ? String(prenda.precioOriginal) : "",
      talla: prenda.talla,
      estado: prenda.estado,
      imagen: prenda.imagen,
      equivalencia: prenda.equivalencia || "",
      descripcionEstado: prenda.descripcionEstado || "",
      color: prenda.color || "",
      largo: prenda.medidas?.largo || "",
      busto: prenda.medidas?.busto || "",
      cintura: prenda.medidas?.cintura || "",
      cadera: prenda.medidas?.cadera || "",
      destacada: prenda.destacada || false,
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingPrenda) return;

    const medidas: Record<string, string> = {};
    if (editForm.largo) medidas.largo = editForm.largo;
    if (editForm.busto) medidas.busto = editForm.busto;
    if (editForm.cintura) medidas.cintura = editForm.cintura;
    if (editForm.cadera) medidas.cadera = editForm.cadera;

    await fetch("/api/prendas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingPrenda.id,
        nombre: editForm.nombre,
        marca: editForm.marca || undefined,
        precio: Number(editForm.precio),
        precioOriginal: editForm.precioOriginal ? Number(editForm.precioOriginal) : undefined,
        talla: editForm.talla,
        estado: editForm.estado,
        imagen: editForm.imagen,
        equivalencia: editForm.equivalencia || undefined,
        descripcionEstado: editForm.descripcionEstado || undefined,
        color: editForm.color || undefined,
        destacada: editForm.destacada,
        medidas: Object.keys(medidas).length > 0 ? medidas : undefined,
      }),
    });
    setEditingPrenda(null);
    loadData();
  }

  // ─── Create new drop ─────────────────────────────────────────────
  async function createDrop(e: React.FormEvent) {
    e.preventDefault();
    if (!newDropDate) return;

    const newDrop: Drop = {
      id: `drop-${newDropDate}`,
      fecha: newDropDate,
      dia: newDropDia,
      estado: "proximo",
      prendas: [],
    };

    const data = await (await fetch("/api/prendas")).json();
    data.drops = [...(data.drops || []), newDrop];
    await fetch("/api/prendas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _updateConfig: true, drops: data.drops }),
    });

    setShowNewDropModal(false);
    setNewDropDate("");
    setActiveDrop(newDrop.id);
    loadData();
  }

  // ─── Loading state ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 font-body text-sm">Cargando panel...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* ═══════════ HEADER ═══════════ */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
                  Usa2 Merch
                </span>{" "}
                <span className="text-zinc-500 text-sm font-normal">Admin</span>
              </h1>
            </div>
            <a
              href="/fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-zinc-300 hover:text-white transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
              Ver Preview
            </a>
          </div>

          {/* ─── Stats bar ─── */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <StatCard icon={<Package className="w-4 h-4" />} label="Total" value={total} color="text-zinc-100" />
            <StatCard icon={<ShoppingBag className="w-4 h-4" />} label="Disponibles" value={disponibles} color="text-emerald-400" />
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Vendidas" value={vendidas} color="text-red-400" />
            <StatCard icon={<Sparkles className="w-4 h-4" />} label="Destacadas" value={destacadas} color="text-amber-400" />
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* ═══════════ DROP SELECTOR ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
        >
          <DropTab
            active={activeDrop === "all"}
            onClick={() => setActiveDrop("all")}
            label="Todos"
          />
          {drops.map((drop) => (
            <DropTab
              key={drop.id}
              active={activeDrop === drop.id}
              onClick={() => setActiveDrop(drop.id)}
              label={`${drop.dia === "jueves" ? "Jueves" : "Domingo"} ${new Date(drop.fecha + "T12:00:00").getDate()}`}
              badge={drop.estado === "proximo" ? "Próximo" : undefined}
            />
          ))}
          <button
            onClick={() => setShowNewDropModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-dashed border-white/10 hover:border-white/20 transition-all duration-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Nuevo Drop
          </button>
        </motion.div>

        {/* ═══════════ DRAG & DROP ZONE ═══════════ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 mb-6 text-center transition-all duration-300 ${
            isDragging
              ? "border-violet-400 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
              : "border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <motion.div
            animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isDragging ? "bg-violet-500/20" : "bg-white/5"
              }`}
            >
              <Upload
                className={`w-6 h-6 ${isDragging ? "text-violet-400" : "text-zinc-500"}`}
              />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDragging ? "text-violet-300" : "text-zinc-300"}`}>
                {isDragging ? "Suelta las imágenes aquí" : "Arrastra imágenes o haz click para seleccionar"}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Soporta múltiples archivos · JPG, PNG, WebP
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══════════ GRID DE PRENDAS ═══════════ */}
        {filteredPrendas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <ImagePlus className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No hay prendas en este drop</p>
            <p className="text-zinc-600 text-xs mt-1">Arrastra imágenes arriba para empezar</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPrendas.map((prenda, i) => (
                <PrendaCard
                  key={prenda.id}
                  prenda={prenda}
                  index={i}
                  onToggleDisponible={() => toggleDisponible(prenda)}
                  onToggleDestacada={() => toggleDestacada(prenda)}
                  onEdit={() => openEdit(prenda)}
                  onDelete={() => setDeletingId(prenda.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ═══════════ EDIT MODAL (Bottom Sheet) ═══════════ */}
      <AnimatePresence>
        {editingPrenda && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingPrenda(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-t-3xl border-t border-white/10"
            >
              <div className="max-w-2xl mx-auto p-6">
                {/* Handle */}
                <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold tracking-tight">Editar prenda</h2>
                  <button
                    onClick={() => setEditingPrenda(null)}
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={saveEdit} className="space-y-4">
                  {/* Imagen preview */}
                  {editForm.imagen && (
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden mx-auto border border-white/10">
                      <img
                        src={editForm.imagen}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Nombre"
                      value={editForm.nombre}
                      onChange={(v) => setEditForm({ ...editForm, nombre: v })}
                      required
                      colSpan2
                    />
                    <InputField
                      label="Marca"
                      value={editForm.marca}
                      onChange={(v) => setEditForm({ ...editForm, marca: v })}
                    />
                    <InputField
                      label="Talla"
                      value={editForm.talla}
                      onChange={(v) => setEditForm({ ...editForm, talla: v })}
                      required
                    />
                    <InputField
                      label="Precio"
                      type="number"
                      value={editForm.precio}
                      onChange={(v) => setEditForm({ ...editForm, precio: v })}
                      required
                    />
                    <InputField
                      label="Precio original"
                      type="number"
                      value={editForm.precioOriginal}
                      onChange={(v) => setEditForm({ ...editForm, precioOriginal: v })}
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Estado</label>
                    <select
                      value={editForm.estado}
                      onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-colors"
                    >
                      <option value="nuevo-etiqueta">Nuevo con etiqueta</option>
                      <option value="como-nuevo">Como nuevo</option>
                      <option value="buen-estado">Buen estado</option>
                    </select>
                  </div>

                  <InputField
                    label="URL de imagen"
                    value={editForm.imagen}
                    onChange={(v) => setEditForm({ ...editForm, imagen: v })}
                    required
                  />

                  <InputField
                    label="Color"
                    value={editForm.color}
                    onChange={(v) => setEditForm({ ...editForm, color: v })}
                  />

                  {/* Medidas */}
                  <div>
                    <label className="text-xs text-zinc-500 mb-2 block">Medidas</label>
                    <div className="grid grid-cols-4 gap-2">
                      <InputField label="Largo" value={editForm.largo} onChange={(v) => setEditForm({ ...editForm, largo: v })} small />
                      <InputField label="Busto" value={editForm.busto} onChange={(v) => setEditForm({ ...editForm, busto: v })} small />
                      <InputField label="Cintura" value={editForm.cintura} onChange={(v) => setEditForm({ ...editForm, cintura: v })} small />
                      <InputField label="Cadera" value={editForm.cadera} onChange={(v) => setEditForm({ ...editForm, cadera: v })} small />
                    </div>
                  </div>

                  <InputField
                    label="Equivalencia (ej: M/Zara · 38/H&M)"
                    value={editForm.equivalencia}
                    onChange={(v) => setEditForm({ ...editForm, equivalencia: v })}
                  />

                  <InputField
                    label="Descripción del estado"
                    value={editForm.descripcionEstado}
                    onChange={(v) => setEditForm({ ...editForm, descripcionEstado: v })}
                  />

                  {/* Destacada toggle */}
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, destacada: !editForm.destacada })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl w-full text-sm font-medium transition-all duration-200 ${
                      editForm.destacada
                        ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${editForm.destacada ? "fill-amber-400" : ""}`} />
                    {editForm.destacada ? "⭐ Destacada — CASI NUEVO" : "Marcar como destacada"}
                  </button>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-violet-500/20"
                  >
                    Guardar cambios
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ DELETE CONFIRM ═══════════ */}
      <AnimatePresence>
        {deletingId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
            >
              <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">¿Eliminar prenda?</h3>
                <p className="text-sm text-zinc-400 mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => deletePrenda(deletingId)}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ NEW DROP MODAL ═══════════ */}
      <AnimatePresence>
        {showNewDropModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewDropModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm"
            >
              <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-display font-bold mb-4">Nuevo Drop</h3>
                <form onSubmit={createDrop} className="space-y-4">
                  <InputField
                    label="Fecha"
                    type="date"
                    value={newDropDate}
                    onChange={(v) => setNewDropDate(v)}
                    required
                  />
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Día</label>
                    <select
                      value={newDropDia}
                      onChange={(e) => setNewDropDia(e.target.value)}
                      className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50"
                    >
                      <option value="jueves">Jueves</option>
                      <option value="domingo">Domingo</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewDropModal(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-sky-600 text-white text-sm font-bold transition-all"
                    >
                      Crear Drop
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/5">
      <div className={`${color} flex items-center justify-center mb-1`}>{icon}</div>
      <p className={`text-xl font-bold font-display ${color}`}>{value}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function DropTab({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
        active
          ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
          : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5"
      }`}
    >
      {label}
      {badge && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold uppercase">
          {badge}
        </span>
      )}
    </button>
  );
}

function PrendaCard({
  prenda,
  index,
  onToggleDisponible,
  onToggleDestacada,
  onEdit,
  onDelete,
}: {
  prenda: Prenda;
  index: number;
  onToggleDisponible: () => void;
  onToggleDestacada: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const discount = getDiscount(prenda.precio, prenda.precioOriginal);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
        prenda.destacada
          ? "border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]"
          : "border-white/5 hover:border-white/15"
      } ${!prenda.disponible ? "opacity-60" : ""}`}
    >
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
        <img
          src={prenda.imagen}
          alt={prenda.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Destacada badge */}
        {prenda.destacada && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3 h-3" />
            CASI NUEVO
          </motion.div>
        )}

        {/* Vendido badge */}
        {!prenda.disponible && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
            Vendido
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold">
            -{discount}%
          </div>
        )}

        {/* Quick actions overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <ActionButton
            onClick={onToggleDisponible}
            icon={prenda.disponible ? <Check className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
            label={prenda.disponible ? "Vendido" : "Restaurar"}
            colorClass={
              prenda.disponible
                ? "bg-red-500/80 hover:bg-red-500 text-white"
                : "bg-emerald-500/80 hover:bg-emerald-500 text-white"
            }
          />
          <ActionButton
            onClick={onToggleDestacada}
            icon={<Star className={`w-3.5 h-3.5 ${prenda.destacada ? "fill-current" : ""}`} />}
            label={prenda.destacada ? "Quitar ⭐" : "Destacar"}
            colorClass={
              prenda.destacada
                ? "bg-amber-500/80 hover:bg-amber-500 text-black"
                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            }
          />
          <ActionButton
            onClick={onEdit}
            icon={<Pencil className="w-3.5 h-3.5" />}
            label="Editar"
            colorClass="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          />
          <ActionButton
            onClick={onDelete}
            icon={<Trash2 className="w-3.5 h-3.5" />}
            label="Borrar"
            colorClass="bg-red-500/20 hover:bg-red-500/40 text-red-300 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-zinc-900/80">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {prenda.marca && (
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                {prenda.marca}
              </p>
            )}
            <p className="text-sm font-medium text-zinc-100 truncate">{prenda.nombre}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100">{formatPrice(prenda.precio)}</span>
            {prenda.precioOriginal && prenda.precioOriginal > prenda.precio && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(prenda.precioOriginal)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 font-medium">
              {prenda.talla}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md ${ESTADO_COLORS[prenda.estado] || "bg-white/5 text-zinc-400"}`}>
              {ESTADO_LABELS[prenda.estado] || prenda.estado}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({
  onClick,
  icon,
  label,
  colorClass,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 ${colorClass}`}
      title={label}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required,
  colSpan2,
  small,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  colSpan2?: boolean;
  small?: boolean;
}) {
  return (
    <div className={colSpan2 ? "col-span-2" : ""}>
      {!small && <label className="text-xs text-zinc-500 mb-1 block">{label}</label>}
      <input
        type={type}
        placeholder={small ? label : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full bg-zinc-800 border border-white/10 rounded-xl ${
          small ? "px-2 py-2 text-xs" : "px-4 py-2.5 text-sm"
        } text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors`}
      />
    </div>
  );
}
