// Write your code here
import {Component} from 'react'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getDetails()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    price: data.price,
    description: data.description,
  })

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    console.log(response)

    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const similarProductsData = fetchedData.similar_products.map(each =>
        this.getFormattedData(each),
      )

      this.setState({
        productData: updatedData,
        similarProducts: similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    console.log('yes')
    const {productData, similarProducts, quantity} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      rating,
      totalReviews,
      availability,
      brand,
    } = productData

    return (
      <div className="product-card-container">
        <img src={imageUrl} alt="product" className="product-image" />
        <div className="product-details-container">
          <h1 className="product-name"> {title} </h1>
          <p className="product-price"> RS {price}/- </p>
          <div className="rating-holder-container">
            <div className="rating-box">
              <p className="user-ratings"> {rating} </p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="rating-image"
              />
            </div>
            <p> {totalReviews} Reviews </p>
          </div>
          <p className="product-description"> {description} </p>
          <p className="special-elements">
            <span className="span-element"> Available: </span> {availability}
          </p>
          <p className="special-elements">
            <span className="span-element"> Brand: </span> {brand}
          </p>
          <hr className="horizontal-line" />
          <div className="quantity-container">
            <button className="quantity-buttons" type="button">
              <BsDashSquare className="user-interaction-button" />
            </button>
            <p className="quantity"> {quantity} </p>
            <button className="quantity-buttons" type="button">
              <BsPlusSquare className="user-interaction-button" />
            </button>
          </div>
          <button type="button" className="add-to-cart-btn">
            ADD TO CART
          </button>
        </div>
      </div>
    )
  }

  renderProductsDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductsDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
