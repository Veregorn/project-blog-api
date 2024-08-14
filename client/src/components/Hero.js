import '../styles/Hero.css';

function Hero() {
    return (
        <div id='hero'>
            <div id='hero-text'>
                <h2>Este Blog es una recopilación de los Artículos Top de Dev.to, resumidos y traducidos mediante IA.</h2>
                <h2>Para una información mas extensa, consulta la fuente original.</h2>
            </div>
            <div id='hero-image'>
                <a href='https://dev.to/' target='_blank' rel='noreferrer'>
                    <img id='devto-screenshot' src={require('../devto-screenshot.png')} alt='Dev.to' />
                </a>
            </div>
        </div>
    );
}

export default Hero;