import React from 'react'
import gebura from "../assets/Gebura_StandingSprite.png"
import angela from "../assets/Angela_StandingSprite.png"
import chesed from "../assets/Chesed_StandingSprite.png"
import binah from "../assets/Binah_StandingSprite.png"
export default function Default() {
  return (
    <div class="default-content">
      <div>
        <a href='https://lobotomycorporation.wiki.gg/'>Just a better wiki</a>
      </div>
      Default
      <img class="angela" src={angela}/>
      <img class="chesed" src={chesed}/>
      <img class="binah" src={binah}/>
      <img class="gebura" src={gebura}/>
      </div>
  )
}
