const RECOMMENDATIONS_ADDRESS = process.env.RECOMMENDATIONS_ADDRESS || 'localhost';

module.exports = {
  "recommendations": `http://${RECOMMENDATIONS_ADDRESS}}/app`
}