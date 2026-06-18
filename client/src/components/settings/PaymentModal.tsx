import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, RefreshCw, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";

export interface PaymentModalCoupon {
  id: string;
  code: string;
  discount: number;
  expiresAt: string;
  used: boolean;
}

export interface PaymentModalPaymentMethod {
  id: string;
  brand: string;
  last4: string;
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle: string;
  itemName: string;
  itemDescription?: string;
  itemPrice: number;
  changeTypeLabel: string;
  billingTimingLabel: string;
  isImmediate: boolean;
  paymentLineLabel: string;
  footerNote: string;
  confirmLabel: string;
  coupons: PaymentModalCoupon[];
  paymentMethods: PaymentModalPaymentMethod[];
  formatAmount: (n: number) => string;
  onConfirm: () => void;
}

export default function PaymentModal({
  open,
  onOpenChange,
  title,
  subtitle,
  itemName,
  itemDescription,
  itemPrice,
  changeTypeLabel,
  billingTimingLabel,
  isImmediate,
  paymentLineLabel,
  footerNote,
  confirmLabel,
  coupons,
  paymentMethods,
  formatAmount,
  onConfirm,
}: PaymentModalProps) {
  const { language, t } = useLanguage();
  const [selectedCouponIds, setSelectedCouponIds] = useState<string[]>([]);
  const [changePm, setChangePm] = useState("default");

  useEffect(() => {
    if (open) {
      setSelectedCouponIds([]);
      setChangePm("default");
    }
  }, [open]);

  const applicableCoupons = (() => {
    const now = new Date();
    return coupons.filter((c) => !c.used && new Date(c.expiresAt) >= now);
  })();

  const discountAmount = Math.min(
    itemPrice,
    Math.round(
      selectedCouponIds.reduce((sum, id) => {
        const c = coupons.find((x) => x.id === id);
        return sum + (c ? (itemPrice * c.discount) / 100 : 0);
      }, 0),
    ),
  );
  const finalAmount = Math.max(0, itemPrice - discountAmount);

  const nextBillingDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return language === "ko"
      ? `${y}. ${m}. ${day}. 오전 12:00`
      : `${m}/${day}/${y}, 12:00 AM`;
  })();

  const toggleCoupon = (id: string) => {
    setSelectedCouponIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const recalcAmounts = () => {
    toast({ title: t("stRecalculated"), description: t("stRecalculatedDesc") });
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background" data-testid="dialog-change-preview">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Zap className="w-5 h-5 text-primary" />
                {title}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {subtitle}
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 bg-background"
              onClick={recalcAmounts}
              data-testid="button-recalculate"
            >
              <RefreshCw className="w-4 h-4" />
              {t("stRecalculate")}
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2 mt-2">
          {/* Left column */}
          <div className="space-y-4">
            {/* Selected item */}
            <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
              <div className="text-xs text-muted-foreground mb-1">{t("stSelectedPlan")}</div>
              <div className="text-2xl font-bold" data-testid="text-selected-plan-name">{itemName}</div>
              {itemDescription && (
                <div className="text-sm text-muted-foreground mt-1">{itemDescription}</div>
              )}
              <div className="text-sm mt-3">
                {t("stMonthlyFee")} <span className="font-semibold">{formatAmount(itemPrice)}</span>
              </div>
            </div>

            {/* Coupon selection */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <div className="font-medium text-sm">{t("stCouponSelect")}</div>
              <div className="text-xs text-muted-foreground mt-0.5 mb-3">{t("stCouponSelectDesc")}</div>
              {applicableCoupons.length === 0 ? (
                <div className="text-sm text-muted-foreground py-5 text-center border border-dashed rounded-lg" data-testid="text-no-applicable-coupons">
                  {t("stNoApplicableCoupons")}
                </div>
              ) : (
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {applicableCoupons.map((c) => {
                    const isSelected = selectedCouponIds.includes(c.id);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => toggleCoupon(c.id)}
                        aria-pressed={isSelected}
                        className={`w-full flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors text-left ${isSelected ? "border-primary bg-primary/5" : "border-emerald-100 bg-background hover:bg-emerald-50"}`}
                        data-testid={`change-coupon-${c.id}`}
                      >
                        <Badge variant="secondary" className="font-mono text-xs shrink-0">{c.code}</Badge>
                        <span className="text-sm font-medium text-emerald-600">{c.discount}% {t("stDiscount")}</span>
                        <span
                          className={`ml-auto shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary" : "border-muted-foreground/30"}`}
                          data-testid={`radio-coupon-${c.id}`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-primary" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4">
              <div className="font-medium text-sm mb-3">{t("stPaymentMethodSelect")}</div>
              <Select value={changePm} onValueChange={setChangePm}>
                <SelectTrigger data-testid="select-change-payment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">{t("stUseDefaultPayment")}</SelectItem>
                  {paymentMethods.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      {pm.brand} · {t("stCardEnding")} {pm.last4}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{t("stPaymentMethodHelp")}</p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                <div className="text-xs text-muted-foreground mb-1">{t("stChangeType")}</div>
                <div className="text-lg font-semibold" data-testid="text-change-type">{changeTypeLabel}</div>
              </div>
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="text-xs text-muted-foreground mb-1">{t("stBillingTiming")}</div>
                <div className="text-lg font-semibold flex items-center gap-1.5" data-testid="text-billing-timing">
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                  {billingTimingLabel}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{isImmediate ? t("stImmediateProceed") : t("stScheduledProceed")}</div>
                <div className="text-sm">{t("stNextBillingDate")} <span className="font-medium">{nextBillingDate}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border bg-background p-3">
                  <div className="text-[11px] text-muted-foreground mb-1">{t("stAmountBeforeDiscount")}</div>
                  <div className="text-base font-bold" data-testid="text-amount-before">{formatAmount(itemPrice)}</div>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                  <div className="text-[11px] text-muted-foreground mb-1">{t("stTotalDiscount")}</div>
                  <div className="text-base font-bold text-emerald-600" data-testid="text-total-discount">-{formatAmount(discountAmount)}</div>
                </div>
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                  <div className="text-[11px] text-muted-foreground mb-1">{t("stFinalAmount")}</div>
                  <div className="text-base font-bold text-primary" data-testid="text-final-amount">{formatAmount(finalAmount)}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="font-medium text-sm">{t("stAmountDetail")}</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{paymentLineLabel}</span>
                  <span className="font-medium">{formatAmount(itemPrice)}</span>
                </div>
                {selectedCouponIds.map((id) => {
                  const c = coupons.find((x) => x.id === id);
                  if (!c) return null;
                  return (
                    <div key={id} className="flex items-center justify-between text-sm" data-testid={`detail-coupon-${id}`}>
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">{c.code}</Badge>
                        {c.discount}% {t("stDiscount")}
                      </span>
                      <span className="font-medium text-emerald-600">-{formatAmount(Math.round((itemPrice * c.discount) / 100))}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 sm:justify-between gap-3 flex-col-reverse sm:flex-row items-center">
          <p className="text-xs text-muted-foreground">
            {footerNote}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-change">
              {t("stCancelSelection")}
            </Button>
            <Button className="gap-2" onClick={handleConfirm} data-testid="button-execute-change">
              <CreditCard className="w-4 h-4" />
              {confirmLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
