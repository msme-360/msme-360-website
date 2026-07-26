"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface LineItem {
  id: string
  item_name: string
  quantity: number
  unit_price: number
  tax_percent: number
  line_total: number
}

interface LineItemsTableProps {
  items: LineItem[]
  onItemUpdate: (id: string, field: string, value: string) => void
  onItemDelete: (id: string) => void
}

export default function LineItemsTable({
  items,
  onItemUpdate,
  onItemDelete
}: LineItemsTableProps) {
  const [editingCell, setEditingCell] = useState<{
    id: string
    field: string
  } | null>(null)

  const handleCellClick = (id: string, field: string) => {
    setEditingCell({ id, field })
  }

  const handleCellBlur = (
    id: string,
    field: string,
    value: string
  ) => {
    onItemUpdate(id, field, value)
    setEditingCell(null)
  }

  const isEditing = (id: string, field: string) =>
    editingCell?.id === id && editingCell?.field === field

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Line Items
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Products and services in this invoice
            </p>
          </div>
        </div>
        <span className="text-xs font-black uppercase tracking-widest opacity-60">
          {items.length} items
        </span>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center py-10 space-y-2">
          <ShoppingCart className="w-8 h-8 text-muted-foreground opacity-40" />
          <p className="text-xs font-black uppercase tracking-widest opacity-60">
            No line items detected
          </p>
        </div>
      )}

      {/* Table */}
      {items.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">

            {/* Head */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Item
                </th>
                <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Qty
                </th>
                <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Unit Price
                </th>
                <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Tax %
                </th>
                <th className="text-right p-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                  Total
                </th>
                <th className="p-3" />
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {/* Item Name */}
                  <td
                    className="p-3 font-bold cursor-pointer"
                    onClick={() => handleCellClick(item.id, "item_name")}
                  >
                    {isEditing(item.id, "item_name") ? (
                      <input
                        autoFocus
                        defaultValue={item.item_name}
                        onBlur={(e) => handleCellBlur(item.id, "item_name", e.target.value)}
                        className="w-full bg-white/10 border border-primary/50 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none"
                      />
                    ) : (
                      <span>{item.item_name || "—"}</span>
                    )}
                  </td>

                  {/* Quantity */}
                  <td
                    className="p-3 text-right font-bold cursor-pointer"
                    onClick={() => handleCellClick(item.id, "quantity")}
                  >
                    {isEditing(item.id, "quantity") ? (
                      <input
                        autoFocus
                        defaultValue={item.quantity}
                        onBlur={(e) => handleCellBlur(item.id, "quantity", e.target.value)}
                        className="w-16 bg-white/10 border border-primary/50 rounded-lg px-2 py-1 text-sm font-bold text-right focus:outline-none"
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </td>

                  {/* Unit Price */}
                  <td
                    className="p-3 text-right font-bold cursor-pointer"
                    onClick={() => handleCellClick(item.id, "unit_price")}
                  >
                    {isEditing(item.id, "unit_price") ? (
                      <input
                        autoFocus
                        defaultValue={item.unit_price}
                        onBlur={(e) => handleCellBlur(item.id, "unit_price", e.target.value)}
                        className="w-20 bg-white/10 border border-primary/50 rounded-lg px-2 py-1 text-sm font-bold text-right focus:outline-none"
                      />
                    ) : (
                      <span>₹{item.unit_price}</span>
                    )}
                  </td>

                  {/* Tax % */}
                  <td
                    className="p-3 text-right font-bold cursor-pointer"
                    onClick={() => handleCellClick(item.id, "tax_percent")}
                  >
                    {isEditing(item.id, "tax_percent") ? (
                      <input
                        autoFocus
                        defaultValue={item.tax_percent}
                        onBlur={(e) => handleCellBlur(item.id, "tax_percent", e.target.value)}
                        className="w-16 bg-white/10 border border-primary/50 rounded-lg px-2 py-1 text-sm font-bold text-right focus:outline-none"
                      />
                    ) : (
                      <span>{item.tax_percent}%</span>
                    )}
                  </td>

                  {/* Line Total */}
                  <td className="p-3 text-right font-black text-primary">
                    ₹{item.line_total}
                  </td>

                  {/* Delete */}
                  <td className="p-3">
                    <button
                      onClick={() => onItemDelete(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400" />
                    </button>
                  </td>

                </motion.tr>
              ))}
            </tbody>

            {/* Footer Total */}
            <tfoot>
              <tr className="border-t border-white/10 bg-white/5">
                <td colSpan={4} className="p-3 text-xs font-black uppercase tracking-widest opacity-60 text-right">
                  Grand Total
                </td>
                <td className="p-3 text-right font-black text-primary">
                  ₹{items.reduce((sum, item) => sum + item.line_total, 0)}
                </td>
                <td />
              </tr>
            </tfoot>

          </table>
        </div>
      )}

    </motion.div>
  )
}