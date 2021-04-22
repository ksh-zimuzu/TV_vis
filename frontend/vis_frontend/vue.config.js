module.exports = {
    publicPath: process.env.NODE_ENV === 'gh-pages'
        ? '/TV_vis/'
        : '/',
    devServer: {
        disableHostCheck: true
    }
}