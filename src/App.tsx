import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProductsPage from './pages/Products/Products'
import ProductDetailPage from './pages/ProductDetail/ProductDetail'
import CreateProductPage from './pages/CreateProduct/CreateProduct'
import EditProductPage from './pages/EditProduct/EditProduct'

const App: React.FC = () => {
  const basename = import.meta.env.PROD ? '/Fruits-App-test' : '/'

  return (
    <Provider store={store}>
      <Router basename={basename}>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  )
}

export default App