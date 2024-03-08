import React from 'react'

const CartContext = React.createContext({
  cartItemsList: [],
  likeValue: '',
  isLightTheme: '',
  saveColor: '',
  dislikeValue: '',
  onLikeValue: () => {},
  onDisLikeValue: () => {},
  onSaveValue: () => {},
  onThemeValue: () => {},
  onIncrementList: () => {},
})

export default CartContext
