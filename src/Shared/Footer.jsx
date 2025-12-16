const Footer = () => {
    return (
        <footer className="footer p-10 bg-base-200 text-base-content mt-10">
            <aside>
                <h2 className="text-xl font-bold">LoanLink</h2>
                <p>
                    A microloan request and approval tracking platform <br />
                    built for transparency and efficiency.
                </p>
            </aside>

            <nav>
                <h6 className="footer-title">Pages</h6>
                <a className="link link-hover">Home</a>
                <a className="link link-hover">All Loans</a>
                <a className="link link-hover">About</a>
                <a className="link link-hover">Contact</a>
            </nav>

            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
            </nav>

            <div className="w-full text-center mt-6">
                <p>© {new Date().getFullYear()} LoanLink. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
