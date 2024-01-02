"""empty message

Revision ID: 89ea824a6ccb
Revises: 50984003f8f1
Create Date: 2023-08-06 21:58:04.770607

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '89ea824a6ccb'
down_revision = '50984003f8f1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('manager_signup_request',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('password', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_manager_signup_request')),
    sa.UniqueConstraint('email', name=op.f('uq_manager_signup_request_email'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('manager_signup_request')
    # ### end Alembic commands ###
