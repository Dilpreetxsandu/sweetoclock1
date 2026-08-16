import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { IconChevronLeft, IconCheck, IconArrowRight } from "@/components/Icons";

const METHODS = [
  { id: "upi", name: "UPI", desc: "GPay, PhonePe, Paytm & more", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 17 17 7M9 7h8v8" /></svg>
  ) },
  { id: "card", name: "Cards", desc: "Credit / Debit card", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
  ) },
  { id: "netbanking", name: "Netbanking", desc: "All major banks", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 21h18M4 10h16M12 3 3 7h18zM6 10v8M10 10v8M14 10v8M18 10v8" /></svg>
  ) },
  { id: "wallet", name: "Wallets", desc: "Amazon Pay, Mobikwik", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="M16 12h3M3 7l14-4v4" /></svg>
  ) },
  { id: "cod", name: "Pay on Delivery", desc: "Cash / UPI when it arrives", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></svg>
  ) },
];

export default function Payment() {
  const navigate = useNavigate();
  const { cart, total, address, placeOrder } = useCart();
  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState(null);

  // Guards
  if (!order && cart.length === 0) return <Navigate to="/" replace />;
  if (!order && (!address.firstName || address.pincode.length !== 6)) return <Navigate to="/checkout" replace />;

  const pay = () => {
    if (processing) return;
    setProcessing(true);
    // Simulated payment — Razorpay API key/order will be wired in here later.
    setTimeout(() => {
      const o = placeOrder(method);
      setOrder(o);
      setProcessing(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 1500);
  };

  if (order) {
    return (
      <main className="pdp-bg">
        <div className="co-top section-inner">
          <div className="co-layout" style={{ gridTemplateColumns: "1fr", maxWidth: 620, margin: "0 auto" }}>
            <div className="co-card" data-testid="payment-success" style={{ textAlign: "center" }}>
              <div className="success-check" style={{ margin: "0 auto" }}><IconCheck /></div>
              <h2 className="success-heading">
                Payment received, <br />
                <span className="italic-olive">{order.firstName}.</span>
              </h2>
              <p className="success-copy">
                Order <strong>{order.order_number}</strong> is confirmed — packed with love,
                dispatched fresh, delivered to {order.city}.
              </p>
              <div className="success-box">
                <div className="row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                <div className="row"><span>Delivery</span><span>{order.delivery === 0 ? "Free" : `₹${order.delivery}`}</span></div>
                <div className="row total"><span>Paid via {order.paymentMethod.toUpperCase()}</span><span>₹{order.total}</span></div>
              </div>
              <button className="btn-pill btn-ink" style={{ width: "100%", justifyContent: "center", marginTop: 24 }} onClick={() => navigate("/")} data-testid="success-continue">
                Continue shopping <IconArrowRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pdp-bg" data-testid="payment-page">
      <div className="co-top section-inner">
        <button className="co-back-link" onClick={() => navigate("/checkout")}><IconChevronLeft /> Back to address</button>

        <div className="co-steps">
          <span className="co-step done"><span className="num">1</span> Cart</span>
          <span className="co-step-sep" />
          <span className="co-step done"><span className="num">2</span> Address</span>
          <span className="co-step-sep" />
          <span className="co-step active"><span className="num">3</span> Payment</span>
        </div>

        <h1 className="co-heading">Almost <span className="italic-olive">yours.</span></h1>

        <div className="co-layout">
          {/* RAZORPAY PANEL */}
          <div className="rzp-panel" data-testid="razorpay-panel">
            <div className="rzp-header">
              <div className="rzp-brand">
                <span className="rzp-logo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m14 3-8 11h6l-2 7 8-11h-6z" /></svg>
                </span>
                Razorpay
              </div>
              <div className="rzp-amount">
                <div className="lbl">Amount payable</div>
                <div className="val">₹{total}</div>
              </div>
            </div>
            <div className="rzp-merchant">
              Paying <strong>Sweet'O Clock</strong> · Delivering to {address.firstName} {address.lastName}, {address.city}
            </div>
            <div className="rzp-body">
              <div className="rzp-section-title">Choose a payment method</div>
              <div className="rzp-methods">
                {METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`rzp-method${method === m.id ? " active" : ""}`}
                    onClick={() => setMethod(m.id)}
                    data-testid={`pay-method-${m.id}`}
                  >
                    <span className="rzp-ic">{m.icon}</span>
                    <span>
                      <span className="rzp-method-name">{m.name}</span>
                      <span className="rzp-method-desc" style={{ display: "block" }}>{m.desc}</span>
                    </span>
                    <span className="rzp-radio" />
                  </button>
                ))}
              </div>

              <button className="rzp-pay-btn" onClick={pay} disabled={processing} data-testid="rzp-pay-btn">
                {processing ? <><span className="rzp-spinner" /> Processing…</> : `Pay ₹${total}`}
              </button>
              <div className="rzp-secure">🔒 Secured by Razorpay · 256-bit encryption</div>

              <div className="rzp-demo-note" data-testid="rzp-demo-note">
                Demo mode — no real payment is processed yet. Connect your Razorpay API key to accept live payments.
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="co-card co-summary-card">
            <h2 className="co-card-title">Order summary</h2>
            {cart.map((it) => (
              <div className="co-summary-line" key={it.id}>
                <img className="co-summary-img" src={it.image} alt={it.name} />
                <div>
                  <div className="co-summary-name">{it.name}</div>
                  <div className="co-summary-qty">Qty {it.quantity} · {it.unit}</div>
                </div>
                <div className="co-summary-price">₹{it.price * it.quantity}</div>
              </div>
            ))}
            <div className="co-summary-grand">
              <span className="edition-tag" style={{ display: "block" }}>Total</span>
              <span className="amt" data-testid="payment-total">₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
