import axios from 'axios';

import { mockedCompanies, mockedPersons } from './mocked_response';

function formImgURL(img) {
  if (!img?.asset?._ref) {
    return null
  }

  const imgData = img.asset._ref.split('-');

  return `https://cdn.sanity.io/images/${
    import.meta.env.VITE_ADMIN_PROJECT_ID
  }/${import.meta.env.VITE_ADMIN_DATASET}/${imgData[1]}-${imgData[2]}.${
    imgData[3]
  }`;
}

function formImgFocalPoint(img) {
  if (img?.hotspot) {
    return {
      x: img.hotspot.x,
      y: img.hotspot.y,
    }
  }

  if (img?.crop) {
    return {
      x: img.crop.left + (1 - img.crop.right) / 2,
      y: img.crop.top + (1 - img.crop.bottom) / 2,
    }
  }

  return null;
}

export async function fetchGoal() {
  try {
    const {
      data: { result },
    } = await axios.get(
      `https://${import.meta.env.VITE_ADMIN_PROJECT_ID}.apicdn.sanity.io/${
        import.meta.env.VITE_ADMIN_API_VERSION
      }/data/query/${
        import.meta.env.VITE_ADMIN_DATASET
      }?query=*[_type=="goal"]{ _id, goal, raised }`
    );
    return result[0];
  } catch (error) {
    return;
  }
}
export async function fetchCompanies() {
  try {
    return Promise.resolve(mockedCompanies);
    const {
      data: { result },
    } = await axios.get(
      `https://${import.meta.env.VITE_ADMIN_PROJECT_ID}.apicdn.sanity.io/${
        import.meta.env.VITE_ADMIN_API_VERSION
      }/data/query/${
        import.meta.env.VITE_ADMIN_DATASET
      }?query=*[_type=="companies"]{ _id, id, name, logoURL, link, question, answer } | order(id asc)`
    );

    const companies = result.map((res) => {
      // preserve info from logo asset to be used in render calculation
      if (res.logoURL) {
        if (res.logoURL.crop) {
          res.logoCrop = res.logoURL.crop;
        }
        if (res.logoURL.hotspot) {
          res.logoFocalScope = res.logoURL.hotspot;
        }
        res.logoOriginal = res.logoURL;
        res.logoURL = formImgURL(res.logoURL);
      }
      return res;
    });

    return companies;
  } catch (error) {
    return;
  }
}
export async function fetchPeople() {
  return Promise.resolve(mockedPersons);
  try {
    const {
      data: { result },
    } = await axios.get(
      `https://${import.meta.env.VITE_ADMIN_PROJECT_ID}.apicdn.sanity.io/${
        import.meta.env.VITE_ADMIN_API_VERSION
      }/data/query/${
        import.meta.env.VITE_ADMIN_DATASET
      }?query=*[_type=="people"]{ _id, id,firstName,secondName,type, imageURL, facebook, instagram, otherLink, question, answer  } | order(id asc)`
    );

    const people = result.map((res) => {
      if (res.imageURL) {
        res.imageFocalPoint = formImgFocalPoint(res.imageURL);
        res.imageURL = formImgURL(res.imageURL);
      }
      return res;
    });
    return people;
  } catch (error) {
    return;
  }
}

export async function fetchPartners() {
  try {
    const {
      data: { result },
    } = await axios.get(
      `https://${import.meta.env.VITE_ADMIN_PROJECT_ID}.apicdn.sanity.io/${
        import.meta.env.VITE_ADMIN_API_VERSION
      }/data/query/${
        import.meta.env.VITE_ADMIN_DATASET
      }?query=*[_type=="partners"]{ _id, id, name, logoURL, link  } | order(id asc)`
    );

    const partners = result.map((res) => {
      // preserve info from logo asset to be used in render calculation
      if (res.logoURL) {
        if (res.logoURL.crop) {
          res.logoCrop = res.logoURL.crop;
        }
        if (res.logoURL.hotspot) {
          res.logoFocalScope = res.logoURL.hotspot;
        }
        res.logoOriginal = res.logoURL;
        res.logoURL = formImgURL(res.logoURL);
      }
      return res;
    });

    return partners;
  } catch (error) {
    return;
  }
}

export async function postData(userData) {
  const { data } = await axios.post(
    `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: import.meta.env.VITE_CHAT_ID,
      parse_mode: 'html',
      text: userData,
    }
  );

  return data;
}
