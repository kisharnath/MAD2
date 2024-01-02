"""empty message

Revision ID: a7799450721e
Revises: 89ea824a6ccb
Create Date: 2023-08-07 12:52:52.864659

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a7799450721e'
down_revision = '89ea824a6ccb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_details', schema=None) as batch_op:
        batch_op.add_column(sa.Column('month', sa.Integer(), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_details', schema=None) as batch_op:
        batch_op.drop_column('month')

    # ### end Alembic commands ###
