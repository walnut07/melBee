from sqlalchemy.orm import Session
import database.models as models
import database.schemas as schemas
from passlib.context import CryptContext
import database.seed.templates as templates
import mailSender
import json
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_user_template(db: Session, id: int):
    return db.query(models.UserTemplate).filter(models.UserTemplate.user_id == id).all()


def get_user_history(db: Session, id: int):
    return db.query(models.SentHistory).filter(models.SentHistory.user_id == id).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def add_user_template(user: schemas.User, db: Session, usertemplate: schemas.TemplateBase):
    usertemplate = models.UserTemplate(
        user_id=user.id, title=usertemplate.title, thumbnail=usertemplate.thumbnail, body=usertemplate.body)
    db.add(usertemplate)
    # setattr(user, 'usertemplate', usertemplate.json())
    db.commit()
    db.refresh(usertemplate)
    return usertemplate


def add_sent_history(user: schemas.User, db: Session, senthistory: schemas.SentHistory):
    senthistory = models.SentHistory(user_id=user.id, subject=senthistory.subject,
                                     recipients=senthistory.recipients, template=senthistory.template, date_sent=senthistory.date_sent)
    db.add(senthistory)
    db.commit()
    db.refresh(senthistory)
    return senthistory


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Item).offset(skip).limit(limit).all()


def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
    db_item = models.Item(**item.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_template_by_id(db: Session, id: int):
    return db.query(models.Template).filter(models.Template.id == id).first()


def seed_template(db: Session):
    len = db.query(models.Template).count()

    limit = 6
    if len >= limit:
        return None
    db_template_default = models.Template(title="default", thumbnail="data:image/jpeg;base64,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", body=templates.default)
    db.add(db_template_default)
    db_template_flower = models.Template(
        title="flower_shop", thumbnail="https://drive.tiny.cloud/1/fl35fbae1uoirilftuwgiaq0j9tyhw36quejctjkra1aeap9/cf60aaa8-ba81-4b50-b49b-2b573398a465", body=templates.flower_shop)
    db.add(db_template_flower)
    db_template_wedding = models.Template(
        title="wedding_invitation", thumbnail="https://drive.tiny.cloud/1/fl35fbae1uoirilftuwgiaq0j9tyhw36quejctjkra1aeap9/75a11271-7c01-4411-8caf-7dd2d17b12c9", body=templates.wedding)
    db.add(db_template_wedding)
    db_template_tomato = models.Template(
        title="tomatoShop", thumbnail="https://drive.tiny.cloud/1/fl35fbae1uoirilftuwgiaq0j9tyhw36quejctjkra1aeap9/2987c80d-40bb-4bc1-8740-3b5c278aecda", body=templates.tomato)
    db.add(db_template_tomato)
    db.commit()

    return db_template_wedding


def send_email(receivers, subject, message_body):
    return mailSender.send_email(receivers, subject, message_body)


def get_unsub_user(db: Session, id: int):
    return db.query(models.UnsubscribeList).filter(models.UnsubscribeList.user_id == id).all()


def add_unsub_user(user: schemas.User, db: Session, unsub: schemas.UnsubscribeList):
    unsub_user = models.UnsubscribeList(user_id=user.id, email=unsub.email)
    db.add(unsub_user)
    db.commit()
    db.refresh(unsub_user)
    return unsub_user


def get_unsub_user_by_id(db: Session, id: int):
    return db.query(models.UnsubscribeList).filter(models.UnsubscribeList.id == id).first()
