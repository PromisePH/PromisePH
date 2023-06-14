import React from 'react';
import PoliticianCardsSVG from '../../assets/svg/landing_politicians.svg'
function PoliticianCards() {
    return (
        <section className='fixed right-0'>
            <div className='relative h-screen w-full'>
            <img src={PoliticianCardsSVG} alt="politician cards" className="absolute right-0 h-screen w-auto max-w-none -z-10"/>
                <div className=" h-screen w-screen bg-gradient-to-r from-black-pearl"></div>
            </div>

        </section>
    );
}

export default PoliticianCards;