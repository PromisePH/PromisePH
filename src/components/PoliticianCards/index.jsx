import React from 'react';
import PoliticianCardsSVG from '../../assets/svg/landing_politicians.svg'
function PoliticianCards() {
    return (
        <section className='fixed right-0'>
            <img src={PoliticianCardsSVG} alt="politician cards" className='max-w-6xl' />
        </section>
    );
}

export default PoliticianCards;