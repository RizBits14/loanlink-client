import { useParams, NavLink } from "react-router";
import useLoanDetails from "../Hooks/useLoanDetails";

const LoanDetails = () => {
    const { id } = useParams();
    const { data: loan, isError } = useLoanDetails(id);

    if (isError || !loan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 animate-fade-in">
                <h2 className="text-3xl font-bold mb-4 text-error animate-shake">
                    Loan Not Found
                </h2>
                <p className="mb-8 opacity-80 max-w-md">
                    The loan you are trying to access does not exist or has been removed.
                </p>
                <NavLink to="/loans" className="btn btn-primary hover:scale-110 transition">
                    Back to All Loans
                </NavLink>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-24 space-y-16 animate-fade-in-up">

            <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl group"
                style={{ maxWidth: "80%" }}>
                <img
                    src={loan.image}
                    alt={loan.title}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-150 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-slide-up">
                        {loan.title}
                    </h1>
                    <p className="text-white/80 max-w-2xl animate-slide-up delay-150">
                        {loan.description}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">

                <div className="relative bg-base-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-in-left">
                    <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-transparent rounded-3xl blur-xl opacity-0 hover:opacity-100 transition"></div>
                    <div className="relative space-y-6">
                        <p className="text-lg">
                            <span className="font-semibold">Maximum Loan Amount:</span>{" "}
                            <span className="text-primary text-3xl font-bold animate-pulse">
                                ${loan.maxAmount}
                            </span>
                        </p>
                        {loan.duration && (
                            <p className="text-sm opacity-80">
                                <strong>Duration:</strong> {loan.duration}
                            </p>
                        )}
                        <p className="text-sm opacity-80 leading-relaxed">
                            Transparent funding, flexible repayment options, and
                            fast approval designed for modern borrowers.
                        </p>
                    </div>
                </div>

                <div className="relative bg-base-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-in-right">
                    <h3 className="text-2xl font-semibold mb-4">
                        Why Choose This Loan?
                    </h3>
                    <ul className="space-y-4 text-sm opacity-80">
                        <li className="animate-fade-in delay-100">✔ Fast digital approval</li>
                        <li className="animate-fade-in delay-200">✔ No hidden charges</li>
                        <li className="animate-fade-in delay-300">✔ Flexible repayment plans</li>
                        <li className="animate-fade-in delay-400">✔ Trusted financial partners</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-6 animate-fade-in-up">
                <NavLink
                    to="/loans"
                    className="btn btn-outline btn-lg hover:scale-105 transition-all"
                >
                    Back to Loans
                </NavLink>

                <NavLink
                    to={`/apply/${loan._id}`}
                    className="btn btn-primary btn-lg hover:scale-110 hover:shadow-xl transition-all animate-bounce-slow"
                >
                    Apply Now
                </NavLink>
            </div>
        </div>
    );
};

export default LoanDetails;
