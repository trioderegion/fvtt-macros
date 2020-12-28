async function switchImage() {
  const isStock = token.getFlag('world', 'hiddenImage') == undefined;
  const mysteryImg = 'icons/svg/cowled.svg';

  if (isStock) {
    //replace with cowl
    await token.setFlag('world','hiddenImage', token.data.img);
    await token.update({img: mysteryImg});
  }
  else {
    //replace with stock
    const stockImg = token.getFlag('world', 'hiddenImage');
    await token.unsetFlag('world','hiddenImage');
    await token.update({img: stockImg});
  }
}

switchImage();