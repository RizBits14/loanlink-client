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
                <NavLink to="/loans" className="btn btn-primary">
                    Back to All Loans
                </NavLink>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-24 space-y-16 animate-fade-in-up">

            <div
                className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl group"
                style={{ maxWidth: "80%" }}
            >
                <img
                    src={loan.images?.[0]}
                    alt={loan.title}
                    className="w-full h-64 sm:h-72 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        {loan.title}
                    </h1>
                    <p className="text-white/80 max-w-2xl">
                        {loan.description}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">

                <div className="bg-base-100 p-10 rounded-3xl shadow-xl animate-slide-in-left space-y-6">

                    <p className="text-sm">
                        <span className="font-semibold">Category:</span>{" "}
                        <span className="badge badge-primary">{loan.category}</span>
                    </p>

                    <p className="text-lg">
                        <span className="font-semibold">Maximum Loan Amount:</span>{" "}
                        <span className="text-primary text-3xl font-bold">
                            ${loan.maxLoanLimit}
                        </span>
                    </p>

                    <p className="text-lg">
                        <span className="font-semibold">Interest Rate:</span>{" "}
                        <span className="text-secondary font-bold">
                            {loan.interestRate}%
                        </span>
                    </p>

                    <div>
                        <p className="font-semibold mb-2">Available EMI Plans:</p>
                        <div className="flex flex-wrap gap-2">
                            {loan.emiPlans?.map((plan, index) => (
                                <span
                                    key={index}
                                    className="badge badge-outline badge-lg"
                                >
                                    {plan}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 p-10 rounded-3xl shadow-xl animate-slide-in-right">
                    <h3 className="text-2xl font-semibold mb-4">
                        Why Choose This Loan?
                    </h3>
                    <ul className="space-y-4 text-sm opacity-80">
                        <li>✔ Fast digital approval</li>
                        <li>✔ Competitive interest rate</li>
                        <li>✔ Flexible EMI plans</li>
                        <li>✔ Transparent process</li>
                        <li>✔ Trusted financial partners</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-6">
                <NavLink
                    to="/loans"
                    className="btn btn-outline btn-lg"
                >
                    Back to Loans
                </NavLink>

                <NavLink
                    to={`/apply/${loan._id}`}
                    className="btn btn-primary btn-lg animate-bounce-slow"
                >
                    Apply Now
                </NavLink>
            </div>
        </div>
    );
};

export default LoanDetails;
