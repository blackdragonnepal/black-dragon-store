'use client'

import React, { useState } from 'react'

export default function BlackDragonHome() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [orderSubmitted, setOrderSubmitted] = useState(false)

  const products = [
    {
      id: '1',
      name: 'HY350 MAX Ultra HD Projector',
      price: 24500,
      category: 'PROJECTORS',
      sku: 'PRJ-HY350',
      stock: 12,
      desc: '4K Supported, Android 11.0 native, dual Wi-Fi 6, auto keystone correction.',
    },
    {
      id: '2',
      name: 'Jmary FM-180RGB Video Fill Light',
      price: 4200,
      category: 'ELECTRONICS',
      sku: 'LGT-JM180',
      stock: 25,
      desc: 'Professional multi-color RGB light panel with tripod mount.',
    },
    {
      id: '3',
      name: 'R36S Retro Handheld Console',
      price: 5800,
      category: 'ELECTRONIC_TOYS',
      sku: 'GAM-R36S',
      stock: 18,
      desc: '64GB storage, 15,000+ preloaded classic games, IPS HD screen.',
    },
  ]

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderSubmitted(true)
    setTimeout(() => {
      setOrderSubmitted(false)
      setSelectedProduct(null)
    }, 3000)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'sans-serif', padding: '0', margin: '0' }}>
      <header style={{ borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', color: '#fff' }}>
            BD
          </div>
          <span style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>
            BLACK <span style={{ color: '#ef4444' }}>DRAGON</span>
          </span>
        </div>
      </header>

      <section style={{ padding: '60px 20px', textAlign: 'center', borderBottom: '1px solid #1e293b', background: 'linear-gradient(to bottom, #0f172a, #020617)' }}>
        <span style={{ padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600', backgroundColor: '#450a0a', color: '#f87171', border: '1px solid #991b1b', display: 'inline-block', marginBottom: '16px' }}>
          Official Storefront
        </span>
        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px' }}>
          Premium Tech & Modern Lifestyle Hardware
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Explore authentic electronics, smart gear, high-definition projectors, and gaming hardware directly from Black Dragon.
        </p>
      </section>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px', borderLeft: '4px solid #ef4444', paddingLeft: '16px' }}>
          Available Inventory
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>{p.category} | SKU: {p.sku}</span>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '8px 0', color: '#fff' }}>{p.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>{p.desc}</p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Price</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171' }}>NPR {p.price.toLocaleString()}</span>
                </div>
                <button onClick={() => setSelectedProduct(p)} style={{ backgroundColor: '#dc2626', color: '#fff', fontWeight: '600', padding: '10px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  Order / Inquire
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px', maxWidth: '450px', width: '100%', position: 'relative' }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
            {orderSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>&#10003;</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Order Received!</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Our team will contact you shortly at your phone number to confirm delivery.</p>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Place Order Request</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px' }}>Item: <span style={{ color: '#f87171', fontWeight: '600' }}>{selectedProduct.name}</span> (NPR {selectedProduct.price.toLocaleString()})</p>
                <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                    <input required type="text" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', color: '#fff', boxSizing: 'border-box' }} placeholder="Your full name" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Phone Number</label>
                    <input required type="tel" style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', color: '#fff', boxSizing: 'border-box' }} placeholder="Your phone number" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Delivery Address</label>
                    <textarea required rows={3} style={{ width: '100%', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px', color: '#fff', boxSizing: 'border-box' }} placeholder="Specify ward, street, and location"></textarea>
                  </div>
                  <button type="submit" style={{ backgroundColor: '#dc2626', color: '#fff', fontWeight: '600', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '8px' }}>
                    Confirm Delivery Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <footer style={{ borderTop: '1px solid #1e293b', backgroundColor: '#0f172a', padding: '40px 20px', marginTop: '60px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Black Dragon</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>Your official destination for quality electronics, optical hardware, and consumer technology.</p>
          </div>
          <div style={{ fontSize: '14px', color: '#cbd5e1' }}>
            <h4 style={{ fontWeight: '600', color: '#fff', marginBottom: '12px' }}>Store Location & Contact</h4>
            <p><span style={{ color: '#64748b' }}>Location: </span>Bhimdatta Municipality, Ward No. 7, Haldukhal</p>
            <p><span style={{ color: '#64748b' }}>Postal Code: </span>10400</p>
            <p><span style={{ color: '#64748b' }}>Contact Phone: </span><span style={{ color: '#f87171' }}>+977-9868814702</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
