"use client";

import { useState } from "react";
import { Package, ArrowDownToLine, ArrowUpFromLine, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, cn } from "@/lib/utils";
import { stockIn, stockOut } from "@/lib/actions/inventory";
import { toast } from "sonner";

type InventoryRow = {
  id: string;
  product_variant_id: string;
  stock_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  barcode: string | null;
  low_stock_threshold: number;
  updated_at: string;
  product_variant: {
    id: string;
    size: string | null;
    color: string | null;
    fabric: string | null;
    sku_suffix: string | null;
    product: {
      id: string;
      name: string;
      sku: string;
      thumbnail_url: string | null;
    } | null;
  } | null;
};

type DialogMode = "in" | "out" | null;

interface InventoryClientProps {
  initialInventory: InventoryRow[];
}

export function InventoryClient({ initialInventory }: InventoryClientProps) {
  const [filter, setFilter] = useState("all");
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedRow, setSelectedRow] = useState<InventoryRow | null>(null);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = initialInventory.filter((row) => {
    if (filter === "low_stock") {
      return (
        row.available_quantity > 0 &&
        row.available_quantity <= row.low_stock_threshold
      );
    }
    if (filter === "out_of_stock") {
      return row.available_quantity === 0;
    }
    return true;
  });

  const openDialog = (mode: DialogMode, row: InventoryRow) => {
    setDialogMode(mode);
    setSelectedRow(row);
    setQuantity("");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedRow(null);
    setQuantity("");
  };

  const handleStockAction = async () => {
    if (!selectedRow || !quantity) {
      toast.error("Please enter a quantity");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Quantity must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const result =
        dialogMode === "in"
          ? await stockIn(selectedRow.product_variant_id, qty, "system")
          : await stockOut(selectedRow.product_variant_id, qty, "system");

      if (result.success) {
        toast.success(
          dialogMode === "in"
            ? `Added ${qty} units to stock`
            : `Deducted ${qty} units from stock`
        );
        closeDialog();
      } else {
        toast.error(result.error ?? "Operation failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getRowHighlight = (row: InventoryRow) => {
    if (row.available_quantity === 0) return "bg-red-50/50";
    if (row.available_quantity <= row.low_stock_threshold)
      return "bg-orange-50/50";
    return "";
  };

  const getStockBadge = (row: InventoryRow) => {
    if (row.available_quantity === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Out of Stock
        </span>
      );
    }
    if (row.available_quantity <= row.low_stock_threshold) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          <AlertTriangle className="h-3 w-3" /> Low
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        OK
      </span>
    );
  };

  return (
    <>
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">
            All
            <span className="ml-1.5 text-xs bg-muted rounded px-1">
              {initialInventory.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="low_stock">
            Low Stock
            <span className="ml-1.5 text-xs bg-orange-100 text-orange-700 rounded px-1">
              {initialInventory.filter(
                (r) => r.available_quantity > 0 && r.available_quantity <= r.low_stock_threshold
              ).length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="out_of_stock">
            Out of Stock
            <span className="ml-1.5 text-xs bg-red-100 text-red-700 rounded px-1">
              {initialInventory.filter((r) => r.available_quantity === 0).length}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-center">Reserved</TableHead>
                <TableHead className="text-center">Threshold</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No inventory records found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow
                    key={row.id}
                    className={cn(getRowHighlight(row))}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          {row.product_variant?.product?.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={row.product_variant.product.thumbnail_url}
                              alt={row.product_variant.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {row.product_variant?.product?.name ?? "—"}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {row.product_variant?.product?.sku ?? "—"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-wrap gap-1">
                        {row.product_variant?.size && (
                          <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                            {row.product_variant.size}
                          </span>
                        )}
                        {row.product_variant?.color && (
                          <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                            {row.product_variant.color}
                          </span>
                        )}
                        {row.product_variant?.fabric && (
                          <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                            {row.product_variant.fabric}
                          </span>
                        )}
                        {!row.product_variant?.size &&
                          !row.product_variant?.color &&
                          !row.product_variant?.fabric && (
                            <span className="text-muted-foreground text-xs">Default</span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {row.barcode ?? "—"}
                    </TableCell>
                    <TableCell className="text-center text-sm font-medium">
                      {row.stock_quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium">
                          {row.available_quantity}
                        </span>
                        {getStockBadge(row)}
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {row.reserved_quantity}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {row.low_stock_threshold}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(row.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 text-xs h-7 px-2"
                          onClick={() => openDialog("in", row)}
                        >
                          <ArrowDownToLine className="h-3 w-3" />
                          In
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs h-7 px-2"
                          onClick={() => openDialog("out", row)}
                          disabled={row.available_quantity === 0}
                        >
                          <ArrowUpFromLine className="h-3 w-3" />
                          Out
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock In/Out Dialog */}
      <Dialog open={!!dialogMode} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "in" ? "Stock In" : "Stock Out"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRow && (
              <div className="p-3 bg-muted/40 rounded-lg text-sm">
                <p className="font-medium">
                  {selectedRow.product_variant?.product?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Available: {selectedRow.available_quantity} units
                </p>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="qty">
                Quantity to {dialogMode === "in" ? "Add" : "Deduct"}
              </Label>
              <Input
                id="qty"
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleStockAction}
                disabled={loading}
                variant={dialogMode === "out" ? "destructive" : "default"}
              >
                {loading
                  ? "Processing..."
                  : dialogMode === "in"
                  ? "Add Stock"
                  : "Deduct Stock"}
              </Button>
              <Button variant="outline" onClick={closeDialog} disabled={loading}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
