
import { Link } from "react-router-dom";
import "../style/home.css";

function Home() {
    const services = [
        {
            icon: "📢",
            title: "Farmer Complaint",
            description: "Register your farming-related complaints and track their status online.",
            link: "/complaints",
            button: "Register Complaint"
        },
        {
            icon: "🚜",
            title: "Equipment Rental",
            description: "Book agricultural equipment and machinery for your farming needs.",
            link: "/rentals",
            button: "Book Equipment"
        },
        {
            icon: "🔧",
            title: "Pump Repair",
            description: "Request professional assistance for your pump and irrigation problems.",
            link: "/repairs",
            button: "Request Repair"
        },
        {
            icon: "🌱",
            title: "Agriculture Products",
            description: "Explore useful farming products, irrigation accessories and more.",
            link: "/products",
            button: "Explore Products"
        }
    ];

    return (
        <div className="home-page">

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <span className="hero-tag">
                            🌾 Digital Support for Indian Farmers
                        </span>

                        <h1>
                            Empowering Farmers,
                            <span> Growing the Future</span>
                        </h1>

                        <p>
                            Kisan Suvidha Kendra provides easy access to
                            agricultural services, equipment rental,
                            pump repair and farmer support — all in one place.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/products" className="primary-btn">
                                Explore Services →
                            </Link>

                            <Link to="/dashboard" className="secondary-btn">
                                Farmer Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* About / Intro */}
            <section className="intro-section">
                <div className="section-heading">
                    <span>WELCOME TO KISAN SUVIDHA KENDRA</span>
                    <h2>Your Farming Needs, Our Priority</h2>
                    <p>
                        We aim to make agricultural services more accessible,
                        convenient and reliable for farmers.
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="section-heading">
                    <span>WHAT WE PROVIDE</span>
                    <h2>Our Farmer Services</h2>
                    <p>
                        Get essential farming support through one simple platform.
                    </p>
                </div>

                <div className="services-grid">
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-icon">
                                {service.icon}
                            </div>

                            <h3>{service.title}</h3>

                            <p>{service.description}</p>

                            <Link to={service.link} className="service-link">
                                {service.button} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-image"></div>

                <div className="about-content">
                    <span className="about-tag">ABOUT OUR PLATFORM</span>

                    <h2>
                        Supporting Farmers
                        <span> at Every Step</span>
                    </h2>

                    <p>
                        Kisan Suvidha Kendra is a digital platform designed
                        to connect farmers with important agricultural services.
                        Farmers can submit complaints, request equipment rentals,
                        book pump repair services and explore farming products.
                    </p>

                    <p>
                        Our goal is to reduce the effort required to access
                        farming support and make services easier to manage.
                    </p>

                    <Link to="/dashboard" className="about-btn">
                        Visit Dashboard →
                    </Link>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-section">
                <div className="section-heading">
                    <span>OUR ADVANTAGES</span>
                    <h2>Why Choose Us?</h2>
                </div>

                <div className="why-grid">
                    <div className="why-card">
                        <div>⚡</div>
                        <h3>Easy Access</h3>
                        <p>Access essential farming services through one platform.</p>
                    </div>

                    <div className="why-card">
                        <div>📱</div>
                        <h3>Digital Platform</h3>
                        <p>Manage service requests and complaints online.</p>
                    </div>

                    <div className="why-card">
                        <div>🤝</div>
                        <h3>Farmer Support</h3>
                        <p>Make it easier to request help for farming problems.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Make Farming Easier?</h2>
                <p>
                    Join Kisan Suvidha Kendra and access useful farming services.
                </p>

                <Link to="/register" className="cta-btn">
                    Get Started Today →
                </Link>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <h2>🌾 Kisan Suvidha Kendra</h2>
                <p>Digital Services for Better Farming.</p>

                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/complaints">Complaints</Link>
                    <Link to="/rentals">Equipment Rental</Link>
                    <Link to="/repairs">Pump Repair</Link>
                </div>

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Kisan Suvidha Kendra.
                    All Rights Reserved.
                </div>
            </footer>

        </div>
    );
}

export default Home;
