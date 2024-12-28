import { Facebook, Instagram, X } from "@mui/icons-material";

const Footer = () =>
{
    return (
        <footer className="bg-stone-800 text-white py-16">
            <div className="container mx-auto text-center">
                <p className="text-sm">
                    © { new Date().getFullYear() } Sound Craft Nepal. All Rights Reserved.
                </p>
                <ul className="flex justify-center space-x-4 mt-2">
                    <li>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <Facebook />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <X />
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            <Instagram />
                        </a>
                    </li>
                </ul>
            </div>
        </footer >
    );
};

export default Footer;
