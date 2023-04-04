// Write your code here
import {Component} from 'react'
import {Cookies} from 'js-cookie'
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
  })

  getDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `http://localhost:3000/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
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
    const {productData, similarProducts} = this.state
    const {imageUrl, title} = productData

    return (
      <div className="product-card-container">
        <img src={imageUrl} alt="product" className="product-image" />
        <div className="product-details-container">
          <h1 className="product-name"> {title} </h1>
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
      <div className="product-item-details-container">
        <Header />
        {this.renderProductsDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
