import React  from "react";
import '../../assets/styles/faq-styles.css';
import { Link } from "react-router-dom";

export default function FAQ() {
    return (
        <section className="container">
        <div className="row">
            <div className="col-xl-12">
            <div className="card">
                <div className="card-body">
                {/* Start Header */}
                <div className="row justify-content-center mt-4">
                    <div className="col-xl-5 col-lg-8">
                    <div className="text-center">
                        <h3>Frequently Asked Questions?</h3>
                        <p className="text-dark" id="faq-intro">
                        Below are answers to common questions regarding services, rights, and support for Persons with Disabilities (PWD).
                        </p>
                        <div>
                        <button type="button" className="btn btn-email me-2">Email Us</button>
                        <Link to="/contact" className="btn btn-message">Send us a Message</Link>
                        </div>
                    </div>
                    </div>
                </div>
                {/* End Header */}

                {/* Start Pills */}
                <div className="row justify-content-center mt-5">
                    <div className="col-9">
                    {/* Start Pills Selection */}
                    <ul className="nav nav-tabs nav-justified justify-content-center faq-tab-box" id="pills-tab" role="tablist">
                        <li className="nav-item pills-list" role="presentation">
                        <button
                            className="nav-link active rounded-top"
                            id="pills-general-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-general"
                            type="button"
                            role="tab"
                            aria-controls="pills-general"
                            aria-selected="true"
                        >
                            <span className="font-size-16">General Questions</span>
                        </button>
                        </li>

                        <li className="nav-item pills-list" role="presentation">
                        <button
                            className="nav-link rounded-top"
                            id="pills-privacy_policy-tab"
                            data-bs-toggle="pill"
                            data-bs-target="#pills-privacy_policy"
                            type="button"
                            role="tab"
                            aria-controls="pills-privacy_policy"
                            aria-selected="false"
                        >
                            <span className="font-size-16">Privacy Policy</span>
                        </button>
                        </li>
                    </ul>
                    </div>

                    {/* Tab panes */}
                    <div className="col-lg-9">
                    <div className="tab-content pt-3" id="pills-tabContent">
                        <div
                        className="tab-pane fade active show"
                        id="pills-general"
                        role="tabpanel"
                        aria-labelledby="pills-general-tab"
                        >
                        <div className="row g-4 mt-2">
                            <div className="col-lg-6">
                            <h5>Who is eligible to apply for a PWD ID?</h5>
                            <p className="text-dark">
                                Residents of Dasmariñas City with permanent disabilities that significantly impair daily activities. This includes visual,
                                hearing, physical, intellectual, learning, mental, and psychosocial disabilities.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>What documents do I need to prepare?</h5>
                            <p className="text-dark">
                                You'll need a valid government ID, medical certificate from an accredited physician, proof of residency (barangay certificate or utility
                                bill), 2x2 ID picture, and completed application form.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>How long does the application process take?</h5>
                            <p className="text-dark">
                                Processing typically takes 7-10 working days after submission of complete requirements. You will receive an SMS notification once your
                                ID is ready for pickup at the PWD Affairs Office.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>Is there any fee for the PWD ID?</h5>
                            <p className="text-dark">
                                No, the PWD ID application and issuance are completely free of charge for qualified residents of Dasmariñas City.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>What benefits can I avail with the PWD ID?</h5>
                            <p className="text-dark">
                                PWD ID holders are entitled to discounts on medicines, medical services, transportation, and establishments, as well as VAT exemption and
                                special privileges in government services.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>Can I apply online if I'm not tech-savvy?</h5>
                            <p className="text-dark">
                                Yes, our portal is designed to be user-friendly. Alternatively, you can visit the PWD Affairs Office at City Hall for assisted application,
                                or ask family members to help you apply online.
                            </p>
                            </div>
                        </div>
                        </div>

                        <div
                        className="tab-pane fade"
                        id="pills-privacy_policy"
                        role="tabpanel"
                        aria-labelledby="pills-privacy_policy-tab"
                        >
                        <div className="row g-4 mt-2">
                            <div className="col-lg-6">
                            <h5>How is my personal information protected?</h5>
                            <p className="text-dark">
                                We follow the Data Privacy Act of 2012. Your information is encrypted and accessible only to authorized personnel. We never share your
                                data with third parties without your consent.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>What information do you collect?</h5>
                            <p className="text-dark">
                                We collect only necessary information for your PWD application: personal details, contact information, medical certification, and proof of
                                residency. Sensitive data is handled with strict confidentiality.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>How long do you keep my data?</h5>
                            <p className="text-dark">
                                We retain your application data for as long as your PWD ID is valid and for legal compliance purposes. You may request data deletion after
                                your ID expires, subject to government retention policies.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>Can I update my information later?</h5>
                            <p className="text-dark">
                                Yes, you can update your contact details and address through this portal. For changes in disability status or personal information, please
                                visit the PWD Affairs Office for verification.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>Who has access to my medical information?</h5>
                            <p className="text-dark">
                                Only accredited medical reviewers and authorized PWD Affairs Office staff have access to your medical certificate for verification purposes.
                                This information is kept strictly confidential.
                            </p>
                            </div>

                            <div className="col-lg-6">
                            <h5>What if I lose my PWD ID?</h5>
                            <p className="text-dark">
                                Report the loss immediately through this portal or at the PWD Affairs Office. A replacement ID can be issued with a sworn affidavit of loss
                                and minimal processing fee for the replacement card.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    {/* End Pills */}
                    
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>
    );
}
