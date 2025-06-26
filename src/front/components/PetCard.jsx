export function PetCard({pet}) {
    return (
        <div className="card my-card h-100 shadow">
            <img src="https://media.4-paws.org/d/2/5/f/d25ff020556e4b5eae747c55576f3b50886c0b90/cut%20cat%20serhio%2002-1813x1811-720x719.jpg" className="card-img-top" alt="..."/>
                <div className="card-body text-center">
                    <h3 className="card-titler">{pet.name}</h3>
                </div>
        </div>
    )
}