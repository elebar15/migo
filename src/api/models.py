from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum as SQLAEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum

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
    role: Mapped[RoleEnum] = mapped_column(SQLAEnum(RoleEnum), nullable=False, default=RoleEnum.general)

    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'lastname': self.lastname,
            'role': self.role.value
            # do not serialize the password, its a security breach
        }