from typing import Generic, TypeVar, Type, Optional, Any
from sqlmodel import Session, select
from sqlmodel import SQLModel
from uuid import UUID

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    """
    Base repository implementing SOLID principles.
    Provides common CRUD operations for all models.
    """

    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session

    def create(self, obj_in: dict[str, Any]) -> ModelType:
        """Create a new record."""
        db_obj = self.model(**obj_in)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def get_by_id(self, id: UUID) -> Optional[ModelType]:
        """Get a record by ID."""
        statement = select(self.model).where(self.model.id == id)
        return self.session.exec(statement).first()

    def get_multi(
        self,
        skip: int = 0,
        limit: int = 100,
        **filters
    ) -> list[ModelType]:
        """Get multiple records with pagination."""
        statement = select(self.model)

        for key, value in filters.items():
            if hasattr(self.model, key):
                statement = statement.where(getattr(self.model, key) == value)

        statement = statement.offset(skip).limit(limit)
        return list(self.session.exec(statement).all())

    def update(self, id: UUID, obj_in: dict[str, Any]) -> Optional[ModelType]:
        """Update a record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return None

        for key, value in obj_in.items():
            if value is not None and hasattr(db_obj, key):
                setattr(db_obj, key, value)

        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj

    def delete(self, id: UUID) -> bool:
        """Delete a record."""
        db_obj = self.get_by_id(id)
        if not db_obj:
            return False

        self.session.delete(db_obj)
        self.session.commit()
        return True

    def count(self, **filters) -> int:
        """Count records matching filters."""
        statement = select(self.model)

        for key, value in filters.items():
            if hasattr(self.model, key):
                statement = statement.where(getattr(self.model, key) == value)

        return len(list(self.session.exec(statement).all()))
