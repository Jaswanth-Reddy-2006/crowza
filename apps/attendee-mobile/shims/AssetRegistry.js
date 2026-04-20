// Shim for react-native/Libraries/Image/AssetRegistry
// expo-asset and other Expo packages import this at compile time.
// In web builds, we replace it with this minimal implementation.
let _assets = [];

module.exports = {
  registerAsset: function (asset) {
    _assets.push(asset);
    return _assets.length;
  },
  getAssetByID: function (assetId) {
    return _assets[assetId - 1];
  },
  unregisterAsset: function (assetId) {
    delete _assets[assetId - 1];
  },
};
