const MainStore = () =>
{
    const instruments = [
        {
            name: 'Guitar',
            image: 'https://cdn.wallpapersafari.com/21/58/0iW7Cy.jpg'
        },
        {
            name: 'Piano',
            image: 'https://images.pexels.com/photos/164743/pexels-photo-164743.jpeg?cs=srgb&dl=acoustic-brand-brass-164743.jpg&fm=jpg'
        },
        {
            name: 'Drums',
            image: 'http://wallpapercave.com/wp/n9aRS8D.jpg'
        },
        {
            name: 'Violin',
            image: 'http://wallpapercave.com/wp/k7CP1Y9.jpg'
        },
    ];

    return (
        <div className="container explore-page mx-auto py-16">
            <h1 className="text-3xl font-bold mb-8">Explore Our Musical Instruments</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                { instruments.map( ( instrument, index ) => (
                    <div
                        key={ index }
                        className="product-card bg-white shadow-md rounded-lg overflow-hidden transform transition-transform duration-300 cursor-pointer hover:scale-105">
                        <img
                            className="w-full h-48 object-cover bg-blend-darken"
                            src={ instrument.image }
                            alt={ instrument.name }
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">
                                { instrument.name }
                            </h2>
                        </div>
                    </div>
                ) ) }
            </div>
        </div>
    );
};

export default MainStore;