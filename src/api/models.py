from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Enum as SQLAEnum, Integer, Float, ForeignKey, DateTime, func, Text, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from datetime import datetime, date

db = SQLAlchemy()


class RoleEnum(enum.Enum):
    general = 'general'
    admin = 'admin'
    vet = 'vet'


class User(db.Model):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    lastname: Mapped[str] = mapped_column(String(80), nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    salt: Mapped[str] = mapped_column(String(80), nullable=False)
    country: Mapped[str] = mapped_column(String(100), nullable=True)
    city: Mapped[str] = mapped_column(String(100), nullable=True)
    avatar: Mapped[str] = mapped_column(String(180), nullable=True)
    role: Mapped[RoleEnum] = mapped_column(SQLAEnum(RoleEnum), nullable=False, default=RoleEnum.general)

    pets: Mapped[list["Pet"]] = relationship("Pet", back_populates="owner")

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'lastname': self.lastname,
            'role': self.role.value,
            'country': self.country,
            'city': self.city
        }


class Pet(db.Model):  
    __tablename__ = 'pet'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    breed: Mapped[str] = mapped_column(String(80), nullable=True)
    birthdate: Mapped[date] = mapped_column(Date, nullable=True)  
    wheight: Mapped[float] = mapped_column(Float, nullable=True)
    image: Mapped[str] = mapped_column(String(255), nullable=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)

    owner: Mapped["User"] = relationship("User", back_populates="pets")
    clin_historys: Mapped[list["ClinHistory"]] = relationship(
        "ClinHistory",
        back_populates="pet",
        cascade="all, delete-orphan"
    )

    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'breed': self.breed,
            'birthdate': self.birthdate,  
            'wheight': self.wheight,
            'image': self.image,
            'owner_id': self.owner_id
        }

    @staticmethod
    def add_or_update_pet(session, name, breed, birthdate, wheight, image, pet_id=None):
    
        engine = session.get_bind()  
        if "sqlite" in str(engine.url).lower():  
           
            if isinstance(birthdate, str):
                birthdate = datetime.strptime(birthdate, "%Y-%m-%d").date()

        if pet_id: 
            pet = session.query(Pet).get(pet_id)
            pet.name = name
            pet.breed = breed
            pet.birthdate = birthdate
            pet.wheight = wheight
            pet.image = image
        else:  
            pet = Pet(name=name, breed=breed, birthdate=birthdate, wheight=wheight, image=image)
            session.add(pet)

        session.commit()  


class ClinHistory(db.Model):
    __tablename__ = 'clin_history'

    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    event_date: Mapped[datetime] = mapped_column(
        DateTime, default=func.current_timestamp(), onupdate=func.current_timestamp())
    event_name: Mapped[str] = mapped_column(String(80), nullable=False)
    place: Mapped[str] = mapped_column(String(80), nullable=True)
    note: Mapped[str] = mapped_column(Text, nullable=True)
    pet_id: Mapped[int] = mapped_column(ForeignKey('pet.id'), nullable=False)

    pet: Mapped["Pet"] = relationship("Pet", back_populates="clin_historys")

    def serialize(self):
        return {
            'id': self.id,
            'created_at': self.created_at.isoformat(),
            'event_date': self.event_date.isoformat(),
            'event_name': self.event_name,
            'place': self.place,
            'note': self.note,
            'pet_id': self.pet_id,
            'pet_name': self.pet.name
        }