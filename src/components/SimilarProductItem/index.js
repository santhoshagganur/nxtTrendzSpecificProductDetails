// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {title, imageUrl, brand, price, rating} = details

  return (
    <li className="similar-product">
      <img src={imageUrl} alt="similar" className="similar-product-image" />
      <h1> {title} </h1>
      <p> by {brand} </p>
      <div className="price-rating-container">
        <p> Rs {price}/- </p>
        <div className="rating-box">
          <p className="user-ratings"> {rating} </p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="rating-image"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
