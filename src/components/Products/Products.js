import React, { useState } from "react"
import { graphql, StaticQuery } from "gatsby"
import ProductCard from "./ProductCard"

const containerStyles = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  padding: "1rem 0 1rem 0",
}

const Products = () => {
  const [donationType, setDonationType] = useState("monthly")

  return (
    <StaticQuery
      query={graphql`
        query ProductPrices {
          oneTimeAmounts: allStripePrice(
            filter: {
              recurring: { interval: { eq: null } }
              product: { active: { eq: true } }
              id: { ne: "price_1HRIelK9wC3K8Mfty2n0kRtI" }
            }
            sort: { fields: [unit_amount] }
          ) {
            edges {
              node {
                id
                active
                currency
                unit_amount
                product {
                  id
                  name
                  active
                }
              }
            }
          }
          oneTimeFlexible: stripePrice(
            id: { eq: "price_1HRIelK9wC3K8Mfty2n0kRtI" }
          ) {
            id
            active
            currency
            unit_amount
            product {
              id
              name
            }
          }
          monthlyAmounts: allStripePrice(
            filter: {
              recurring: { interval: { eq: "month" } }
              product: { active: { eq: true } }
            }
            sort: { fields: [unit_amount] }
          ) {
            edges {
              node {
                id
                active
                currency
                unit_amount
                product {
                  id
                  name
                }
              }
            }
          }
        }
      `}
      render={({ oneTimeAmounts, monthlyAmounts, oneTimeFlexible }) => {
        return (
          <div>
            <p>Which type of donation do you want to make?</p>
            <div>
              <input
                type="radio"
                id="monthly"
                name="donType"
                value="monthly"
                checked={donationType === "monthly"}
                onChange={() => setDonationType("monthly")}
              />
              <label htmlFor="monthly" style={{ marginLeft: "1em" }}>
                Monthly
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="onetime"
                name="donType"
                value="onetime"
                checked={donationType === "onetime"}
                onChange={() => setDonationType("onetime")}
              />
              <label htmlFor="onetime" style={{ marginLeft: "1em" }}>
                One Time
              </label>
            </div>
            {donationType === "monthly" ? (
              <div style={containerStyles}>
                {monthlyAmounts.edges.map(({ node: option }) => (
                  <ProductCard
                    key={option.id}
                    option={option}
                    recurring={true}
                    flexible={false}
                  />
                ))}
              </div>
            ) : (
              <div style={containerStyles}>
                {oneTimeAmounts.edges.map(({ node: option }) => (
                  <ProductCard
                    key={option.id}
                    option={option}
                    recurring={false}
                    flexible={false}
                  />
                ))}
                <ProductCard
                  option={oneTimeFlexible}
                  recurring={false}
                  flexible={true}
                />
              </div>
            )}
          </div>
        )
      }}
    />
  )
}

export default Products
