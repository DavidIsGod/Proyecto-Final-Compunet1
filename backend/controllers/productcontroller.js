exports.getProducts = (req, res) => {
    res.json({ message: 'Aquí van los productos' });
};

exports.addProduct = (req, res) => {
    res.json({ message: 'Producto agregado' });
};
