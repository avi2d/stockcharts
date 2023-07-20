declare global {
  interface Window {
    getCurrentVariantKey: () => Promise<any>;
  }
}

const screenShotVariantLoader = () =>
  window.getCurrentVariantKey &&
  window.getCurrentVariantKey().then(({keys = []}) => ({
    variant: keys[0],
  }));

export const loaders = [screenShotVariantLoader];
