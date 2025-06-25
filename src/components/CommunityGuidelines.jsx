import navicon from '../icons/navicon.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const CommunityGuidelines = () => {
    const navigate = useNavigate();

    return (
        <div className=" vh-100 position-relative" >
            {/* Header */}
            <div className=" bg-white sticky-top d-flex align-items-center shadow-sm" style={{ height: '10.5vh', paddingLeft: '19vw' }}>
                <img 
                    src={navicon} 
                    alt="SpaceMatch Logo" 
                    className="img-fluid cursor-pointer"
                    style={{cursor:'pointer', maxHeight: '100%', objectFit: 'contain' }}
                    onClick={() => navigate('/')}
                />
                <span 
                    className="fs-1 fw-bolder ms-2 cursor-pointer" 
                    style={{ letterSpacing: '-2px' }}
                    onClick={() => navigate('/')}
                >
                    SpaceMatch
                </span>
            </div>

            {/* Content */}
            <div className="container py-4 px-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h1 className="fw-bold display-5 mb-4">Community Guidelines</h1>
                        
                        <p className="text-muted fs-5 lh-lg mb-4">
                            Welcome to SpaceMatch! <br />
                            We're building a friendly community where professionals can find great workspaces. 
                            These simple rules help keep everyone safe and happy.
                        </p>
                        
                        <p className="text-muted fs-5 lh-lg mb-4">
                            We want SpaceMatch to be a fun, safe, and inclusive place where all members feel comfortable.{" "}
                            <strong className="fw-bold">
                                That's the purpose of the SpaceMatch Community Guidelines. They define the expected behavior for members both on the app and in real life.
                            </strong>{" "}
                            We encourage you to read them, as failing to follow these rules can have real consequences.
                        </p>

                        <h2 className="fw-bold mt-5 mb-4 fs-3">SpaceMatch Guidelines:</h2>
                        
                        <ol className="list-group list-group-numbered">
                            <li className="list-group-item border-0 bg-white ps-0 mb-3">
                                <strong className="fw-bold text-muted">Be Respectful. </strong>
                                <span className="text-muted lh-lg">
                                    Treat all members with kindness. We don't tolerate bullying, discrimination, or harassment. 
                                    Remember that people come from different backgrounds and professions - keep conversations professional and positive.
                                </span>
                            </li>
                            
                            <li className="list-group-item border-0 bg-white ps-0 mb-3">
                                <strong className="fw-bold text-muted">Keep It Real. </strong>
                                <span className="text-muted lh-lg">
                                    Use your real identity and accurate photos. Workspace hosts must provide honest descriptions of their spaces, 
                                    including clear photos and correct pricing. No fake listings or misleading information.
                                </span>
                            </li>
                            
                            <li className="list-group-item border-0 bg-white ps-0 mb-3">
                                <strong className="fw-bold text-muted">Protect Privacy. </strong>
                                <span className="text-muted lh-lg">
                                    Never share personal financial information, home addresses, or passwords. Be cautious about sharing your daily 
                                    routines or sensitive business details with people you've just met.
                                </span>
                            </li>
                            
                            <li className="list-group-item border-0 bg-white ps-0 mb-3">
                                <strong className="fw-bold text-muted">Professional Use Only. </strong>
                                <span className="text-muted lh-lg">
                                    This platform is for workspace connections only. No dating solicitations, product sales or illegal activities. 
                                    Let's keep SpaceMatch focused on work.
                                </span>
                            </li>
                            
                            <li className="list-group-item border-0 bg-white ps-0 mb-3">
                                <strong className="fw-bold text-muted">Safety First. </strong>
                                <span className="text-muted lh-lg">
                                    If someone makes you uncomfortable or breaks these rules, stop communicating with them immediately. 
                                    Use our reporting tools to alert us - all reports are confidential.
                                </span>
                            </li>
                        </ol>

                        <h2 className="fw-bold mt-5 mb-3 fs-3">Consequences:</h2>
                        
                        <p className="text-muted fs-5 lh-lg mb-5">
                            We may warn, suspend, or ban accounts that break these rules. Serious violations will result in immediate removal from SpaceMatch.
                            <br />Thanks for helping us build a great community! If you have questions, contact our support team anytime.
                        </p>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-around border-top pt-4">
              <Button 
                variant="outline-dark" 
                onClick={() => navigate('/safetytips')}
              >
                ← Safety Tips
              </Button>
              <Button 
                variant="dark"
                onClick={() => navigate('/contact')}
              >
                Contact Safety Team
              </Button>
            </div>
            {/* Footer */}
            <div className="copyright-section py-4 border-top text-center">
                © {new Date().getFullYear()} SpaceMatch. All rights reserved.
            </div>
        </div>
    );
};

export default CommunityGuidelines;