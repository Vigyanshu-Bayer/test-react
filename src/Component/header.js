import React from 'react'

export default function header() {
    return (
        <header className="py-3 mb-3 border-bottom">
            <div className="container-fluid d-grid gap-3 align-items-center" style={{ gridTemplateColumns: "1fr 2fr" }} >
                <div className="dropdown">
                    <a
                        href="/"
                        className="d-flex align-items-center col-lg-4 mb-2 mb-lg-0 link-dark text-decoration-none justify-content-start"
                    ><h3>NXTGEN</h3>
                    </a>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                    <div className="flex-shrink-0 dropdown">
                        {/* <img
                            src="assets/bayer_logo.png"
                            alt="mdo"
                            width={150}
                            height={50}
                        /> */}
                    </div>
                </div>
            </div>
        </header>

    )
}
