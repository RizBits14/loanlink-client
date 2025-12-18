import { useParams, NavLink } from "react-router";

const mockLoans = [
    {
        id: "1",
        title: "Micro Business Loan",
        description:
            "Designed for small business owners and startups to expand operations and manage cash flow.",
        amount: "$2,000 – $10,000",
        duration: "6 – 24 months",
        interest: "8% – 12%",
        eligibility: [
            "Valid business registration",
            "Minimum 1 year operation",
            "Basic financial records",
        ],
    },
    {
        id: "2",
        title: "Education Support Loan",
        description:
            "Supports students and professionals in funding education and skill development programs.",
        amount: "$1,000 – $5,000",
        duration: "6 – 18 months",
        interest: "6% – 10%",
        eligibility: [
            "Admission confirmation",
            "Valid ID",
            "Co-applicant if required",
        ],
    },
];

const LoanDetails = () => {
    const { id } = useParams();
    const loan = mockLoans.find((l) => l.id === id);

    if (!loan) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Loan Not Found</h2>
                <p className="mb-6 opacity-80">
                    The loan you are looking for does not exist.
                </p>
                <NavLink to="/loans" className="btn btn-primary">
                    Back to All Loans
                </NavLink>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-4xl font-bold mb-3">{loan.title}</h1>
                <p className="opacity-80 max-w-2xl">{loan.description}</p>
            </div>

            {/* DETAILS GRID */}
            <div className="grid md:grid-cols-2 gap-10 bg-base-100 p-8 rounded-xl shadow">
                <div className="space-y-4 text-sm">
                    <p><strong>Loan Amount:</strong> {loan.amount}</p>
                    <p><strong>Duration:</strong> {loan.duration}</p>
                    <p><strong>Interest Rate:</strong> {loan.interest}</p>
                </div>

                <div>
                    <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm opacity-90">
                        {loan.eligibility.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* ACTION */}
            <div className="flex justify-between items-center">
                <NavLink to="/loans" className="btn btn-outline">
                    Back to Loans
                </NavLink>

                <NavLink
                    to={`/apply/${loan.id}`}
                    className="btn btn-primary"
                >
                    Apply Now
                </NavLink>
            </div>

        </div>
    );
};

export default LoanDetails;
