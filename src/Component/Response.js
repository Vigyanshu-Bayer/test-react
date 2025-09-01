import React from 'react'
import Card from 'react-bootstrap/Card';

function Response(prop) {
    const { apiResponse } = prop;
    return (
        <>
            {
                apiResponse.map((e, k) => {
                    return (
                        <Card key={k} style={{ margin: "1% 5%" }}>
                            <Card.Body>
                                <Card.Title>{e.path}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                                <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link>
                            </Card.Body>
                        </Card>
                    )
                })
            }
        </>
    )
}

export default Response