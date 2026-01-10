
import { Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-slate-900 border-t border-white/5 pt-16 pb-8 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-3 mb-6 group w-fit">
                            <div className="relative p-1 rounded-lg border border-white/10 bg-white/5">
                                <img src="/logo pour affiche.png" alt="ENSIASD Logo" className="h-10 w-auto object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                ENSIASD Certif
                            </span>
                        </Link>
                        <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                            La première plateforme de certification de diplômes basée sur la blockchain au Maroc. Sécurité, transparence et innovation académique.
                        </p>
                        <div className="flex gap-4">
                            {[Github, Linkedin, Twitter].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/20"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Accueil', path: '/' },
                                { label: 'Vérifier un diplôme', path: '/verify' },
                                { label: 'Espace Étudiant', path: '/login' },
                                { label: 'Accès Admin', path: '/admin-login' }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-400 transition-colors"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact / Help */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Contact & Aide</h4>
                        <ul className="space-y-4 text-slate-400">
                            <li>support@ensiasd-certif.ma</li>
                            <li>+212 5 37 77 77 77</li>
                            <li>Avenue Mohammed Ben Abdellah Regragui, Rabat</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; {currentYear} ENSIASD Certification. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Fait avec</span>
                        <Heart size={14} className="text-red-500 fill-red-500/20" />
                        <span>par l'équipe Blockchain</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
