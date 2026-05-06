"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Copy,
  Trash2,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { formatDate } from "@/lib/utils";
import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
} from "@/lib/actions/coupons";
import { toast } from "sonner";

type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  expiry_date: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
};

const EMPTY_FORM = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  expiry_date: "",
  usage_limit: "",
  is_active: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCoupons();
      setCoupons((result.data as Coupon[]) ?? []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoupons();
  }, [loadCoupons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      toast.error("Code and discount value are required");
      return;
    }
    setFormLoading(true);
    try {
      const result = await createCoupon({
        code: form.code,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        expiry_date: form.expiry_date || null,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit, 10) : null,
        is_active: form.is_active,
      });
      if (result.success) {
        toast.success("Coupon created successfully");
        setDialogOpen(false);
        setForm(EMPTY_FORM);
        loadCoupons();
      } else {
        toast.error(result.error ?? "Failed to create coupon");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    const result = await deleteCoupon(id);
    if (result.success) {
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      toast.error(result.error ?? "Failed to delete coupon");
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    const result = await toggleCouponStatus(id, !current);
    if (result.success) {
      toast.success(current ? "Coupon deactivated" : "Coupon activated");
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c))
      );
    } else {
      toast.error(result.error ?? "Failed to update status");
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => toast.success(`Copied "${code}"`));
  };

  const isExpired = (expiry: string | null) => {
    if (!expiry) return false;
    return new Date(expiry) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage discount codes and promotions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-center">Used / Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Tag className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No coupons yet. Create your first one!</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => {
                  const expired = isExpired(coupon.expiry_date);
                  return (
                    <TableRow key={coupon.id} className={expired ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-bold bg-muted px-2 py-0.5 rounded">
                            {coupon.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(coupon.code)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                            coupon.discount_type === "percentage"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {coupon.discount_type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {coupon.discount_type === "percentage"
                          ? `${coupon.discount_value}%`
                          : `₹${coupon.discount_value}`}
                      </TableCell>
                      <TableCell>
                        {coupon.expiry_date ? (
                          <span
                            className={`text-xs ${expired ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                          >
                            {expired ? "Expired " : ""}{formatDate(coupon.expiry_date)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">No expiry</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {coupon.used_count} / {coupon.usage_limit ?? "∞"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {coupon.is_active && !expired ? (
                            <>
                              <ToggleRight className="h-4 w-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                              <span className="text-xs text-gray-500">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggle(coupon.id, coupon.is_active)}
                            className="h-8 w-8"
                            title={coupon.is_active ? "Deactivate" : "Activate"}
                          >
                            {coupon.is_active ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Coupon Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setForm(EMPTY_FORM); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="code">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g. SUMMER20"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select
                  value={form.discount_type}
                  onValueChange={(v: "percentage" | "fixed") =>
                    setForm((f) => ({ ...f, discount_type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="discount_value">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={form.discount_type === "percentage" ? "20" : "100"}
                  value={form.discount_value}
                  onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  value={form.usage_limit}
                  onChange={(e) => setForm((f) => ({ ...f, usage_limit: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
              />
              <Label htmlFor="is_active" className="cursor-pointer text-sm">
                Active immediately
              </Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={formLoading} className="flex-1">
                {formLoading ? "Creating..." : "Create Coupon"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setDialogOpen(false); setForm(EMPTY_FORM); }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
