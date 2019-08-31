import React from 'react';

import './Banner.css';

function Banner(props) {
  return (
    <section className='banner display-sm-none' id='welcomeBanner'>
      <h1>Welcome</h1>
      <p>Marker is a forum designed for college students to help each other in solving problems</p>
    </section>
  );
}

export default Banner;