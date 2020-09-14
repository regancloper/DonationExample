import React, { useState } from "react"
import getStripe from "../../utils/stripejs"

const cardStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "flex-start",
  padding: "1rem",
  marginBottom: "1rem",
  boxShadow: "5px 5px 25px 0 rgba(46,61,73,.2)",
  backgroundColor: "#fff",
  borderRadius: "6px",
  width: "300px",
}

const buttonStyles = {
  display: "block",
  fontSize: "13px",
  textAlign: "center",
  color: "#fff",
  padding: "12px",
  boxShadow: "2px 5px 10px rgba(0,0,0,.1)",
  backgroundColor: "seagreen",
  borderRadius: "6px",
  letterSpacing: "1.5px",
  cursor: "pointer",
}

const buttonDisabledStyles = {
  opacity: "0.5",
  cursor: "not-allowed",
}

const formatPrice = (amount, currency) => {
  let price = (amount / 100).toFixed(2)
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  })
  return numberFormat.format(price)
}

const ProductCard = ({ option, recurring, flexible }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    setLoading(true)
    const amount = flexible
      ? Number(new FormData(event.target).get("amtSelect"))
      : 1
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: recurring ? "subscription" : "payment",
      lineItems: [{ price: option.id, quantity: amount }],
      successUrl: `${window.location.origin}/page-2/`,
      cancelUrl: `${window.location.origin}/advanced`,
    })
    if (error) {
      console.warn("Error:", error)
      setLoading(false)
    }
  }

  return (
    <div style={cardStyles}>
      <form onSubmit={handleSubmit}>
        <h4>{option.product.name}</h4>
        {flexible ? (
          <p>
            Price: $
            <input type="number" min="1" name="amtSelect" />
          </p>
        ) : (
          <p>Price: {formatPrice(option.unit_amount, option.currency)}</p>
        )}

        <button
          disabled={loading}
          style={
            loading
              ? { ...buttonStyles, ...buttonDisabledStyles }
              : buttonStyles
          }
        >
          Donate!
        </button>
      </form>
    </div>
  )
}

export default ProductCard
